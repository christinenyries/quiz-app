const animechanBaseUrl = "http://animechan.melosh.space";

export default defineEventHandler(async () => {
  let quotes = [];
  try {
    quotes = await $fetch(`${animechanBaseUrl}/quotes`);
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch quotes",
    });
  }
  return quotes;
});
