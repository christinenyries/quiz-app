import { Quote } from "~/types/animechan";
import { Collection, Genre, Anime } from "@/types/kitsu";
import { Choice, Question } from "@/types";

type QuestionStoreStatus =
  | "notLoaded"
  | "loadingQuotes"
  | "loadingAnimes"
  | "loadingGenres"
  | "loaded"
  | "error";

export const useQuestionsStore = defineStore("questions", () => {
  // Should be divisible by 10 to align with animechan API returning 10 random anime per request
  const count = 10;
  // Modify to change number of choices per question
  const choicesPerQuestionCount = 4;

  const status = ref<QuestionStoreStatus>("notLoaded");
  const statusMessage = computed(
    () =>
      ({
        notLoaded: "The question bank is empty",
        loadingQuotes: "Fetching character quotes from random animes...",
        loadingAnimes: "Fetching more anime data...",
        loadingGenres: "Getting data about anime genres...",
        loaded: "The question bank is full",
        error: "An unexpected error occured",
      }[status.value])
  );

  const questions = reactive<Question[]>([]);
  const index = ref(0);

  const questionNo = computed(() => index.value + 1);
  const question = computed(() =>
    questions.length > index.value ? questions[index.value] : null
  );
  const isLastQuestion = computed(() => questionNo.value === questions.length);
  const clues = computed(() => question.value?.clues);
  const choices = computed(() => question.value?.choices);
  const answer = computed(() => choices.value?.find((c) => c.isCorrect));

  const correctAnswerCount = ref(0);
  const cluesOpenedCount = ref(0);
  const pointsPerCorrectAnswer = 10;
  const score = computed(
    () =>
      correctAnswerCount.value * pointsPerCorrectAnswer - cluesOpenedCount.value
  );
  const maxScore = count * pointsPerCorrectAnswer;

  const load = async () => {
    // Retrieve 40 random animes using animechan API that returns random anime character quotes
    // - 10 of which will be the anime that the user will be asked to guess.
    // - The remaining 30 will be used to generate choices for the questions.
    // So we have 4 choices per question.
    status.value = "loadingQuotes";
    const quotes = await fetchRandomAnimeQuotes();
    // Extract anime titles from `quotes`
    const titles = quotes.map((q) => q.anime);
    // Use `titles` to get more information about the anime from kitsu API
    status.value = "loadingAnimes";
    const animes = await fetchAnimes(titles);
    // Retrieve genre of first 10 animes to be used as clue
    // No need to do this for the remaining 30 as we only need the anime title and image for the choices.
    const links = animes
      .slice(0, 10)
      .map((a) => a.relationships.genres.links.related);
    status.value = "loadingGenres";
    const genres = await fetchGenres(links);
    // Combine data from various APIs above to build the questions
    for (let i = 0; i < count; i++) {
      // Build the clues
      const clues: Question["clues"] = {
        character: quotes[i].character,
        quote: quotes[i].quote,
        synopsis: animes[i].attributes.synopsis,
        startDate: animes[i].attributes.startDate,
        genres: genres[i].join(", "),
      };
      // Build the answer
      const answer: Choice = {
        id: `${quotes[i].key}-${animes[i].id}`,
        image: animes[i].attributes.posterImage.medium,
        text: quotes[i].anime,
        isCorrect: true,
      };
      // Build the choices
      const choices: Choice[] = [answer];
      while (choices.length < choicesPerQuestionCount) {
        // Position of anime to be used as choice
        // e.g. 1st question will use anime at index 10, 20, and 30 as choices
        //      2nd question will use anime at index 11, 21, and 31 as choices
        //      10th question will use anime at index 19, 29, and 39 as choices
        const j = i + count * choices.length;
        const choice: Choice = {
          id: `${quotes[j].key}-${animes[j].id}`,
          image: animes[j].attributes.posterImage.medium,
          text: quotes[j].anime,
          isCorrect: false,
        };
        choices.push(choice);
      }
      // Combine clues and choices to build the question
      const question: Question = {
        clues,
        choices: useShuffle(choices),
      };
      // Add question to store
      questions.push(question);
    }
    status.value = "loaded";
  };

  const goToNextQuestion = () => {
    index.value++;
  };

  // Kitsu API

  const kitsuBaseUrl = "https://kitsu.io/api/edge/anime";

  const fetchAnimes = async (titles: Quote["anime"][]) => {
    const animes = await Promise.all(titles.map(fetchAnime));
    return animes;
  };

  const fetchAnime = async (title: string) => {
    const response = await $fetch<Collection<Anime>>(
      `${kitsuBaseUrl}?filter[text]=${title}&page[limit]=1`,
      {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
      }
    );
    if (response.data.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: `Cannot find anime with title: ${title}`,
      });
    }
    const anime = response.data[0];
    return anime;
  };

  const fetchGenres = async (
    links: Anime["relationships"]["genres"]["links"]["related"][]
  ) => {
    const genres = await Promise.all(links.map(fetchGenre));
    return genres;
  };

  const fetchGenre = async (link: string) => {
    const response = await $fetch<Collection<Genre>>(link);

    if (response.data.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: `No genre found on link: ${link}`,
      });
    }
    const genres = response.data.map((genre) => genre.attributes.name);
    return genres;
  };

  // Animechan API

  const fetchRandomAnimeQuotes = async () => {
    if (count % 10 !== 0) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid number of questions: ${count}. Should be divisible by 10.`,
      });
    }

    const quotesPerRequest = 10;
    const requestCount = (count * choicesPerQuestionCount) / quotesPerRequest;
    const response = await Promise.all(
      Array.from({ length: requestCount }, fetch10RandomAnimeQuotes)
    );
    const quotes = Array<Quote>().concat(...response);
    return quotes;
  };
  const fetch10RandomAnimeQuotes = () => $fetch<Quote[]>("/api/quotes");

  return {
    load,
    goToNextQuestion,
    count,
    questionNo,
    clues,
    choices,
    cluesOpenedCount,
    correctAnswerCount,
    score,
    maxScore,
    status,
    isLastQuestion,
    answer,
    pointsPerCorrectAnswer,
    statusMessage,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useQuestionsStore, import.meta.hot));
}
