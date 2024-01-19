import React from "react";
import "../App.css";

const Section = ({ text, setText, ssml, setSSML }) => {
  return (
    <div className="section-container">
      <textarea
        value={text}
        style={{ padding: 15 }}
        placeholder="Write your text to convert. After converting click the play button below to play."
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="checkbox">
        <label>Use SSML:</label>
        <input
          className="checkbox-input"
          type="checkbox"
          checked={ssml}
          onChange={() => setSSML(!ssml)}
        />
      </div>
    </div>
  );
};

export default Section;
