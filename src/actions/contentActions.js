import axios from "axios";

export const fetchContentSuccess = (content) => ({
  type: "FETCH_CONTENT_SUCCESS",
  payload: content,
});

export const fetchContentError = (error) => ({
  type: "FETCH_CONTENT_ERROR",
  payload: error,
});

export const contentLoading = () => ({
  type: "CONTENT_LOADING",
});

export const contentLoaded = () => ({
  type: "CONTENT_LOADED",
});

export const fetchContent = () => async (dispatch) => {
  try {
    dispatch(contentLoading());
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );

    const articles = response.data.articles;
    const newsText = articles.map((article) => article.title).join(". ");
    dispatch(fetchContentSuccess(newsText));
    dispatch(contentLoaded());
  } catch (error) {
    dispatch(fetchContentError(error));
    dispatch(contentLoaded());
  }
};
