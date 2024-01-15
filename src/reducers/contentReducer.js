const initialState = {
  content: "",
  error: "",
  loading: false,
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CONTENT_SUCCESS":
      console.log("Reducer", action.payload);
      return { ...state, content: action.payload };

    case "FETCH_CONTENT_ERROR":
      return { ...state, error: action.payload };
    case "CONTENT_LOADING":
      return { ...state, loading: true };
    case "CONTENT_LOADED":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default contentReducer;
