const animechanBaseUrl = "http://animechan.melosh.space";

export default defineEventHandler(async () => {
  try {
    return await $fetch(`${animechanBaseUrl}/quotes`);
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch quotes",
    });
  }
});
