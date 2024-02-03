import DOMPurify from "dompurify";
import "../App.css";

interface SpeechTextEditorProps {
  text: string;
  setText: (value: string) => void;
  ssml: boolean;
  setSSML: (ssml: boolean) => void;
}

const SpeechTextEditor = ({
  text,
  setText,
  ssml,
  setSSML,
}: SpeechTextEditorProps) => {
  const sanitizedText = DOMPurify.sanitize(text);

  return (
    <div className="section-container">
      <textarea
        value={sanitizedText}
        style={{ padding: 15 }}
        placeholder="Write your text to convert. After converting click the play button below to play."
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="checkbox">
        <label htmlFor="ssmlCheckbox">Use SSML:</label>
        <input
          id="ssmlCheckbox"
          className="checkbox-input"
          type="checkbox"
          checked={ssml}
          onChange={() => setSSML(!ssml)}
        />
      </div>
    </div>
  );
};

export default SpeechTextEditor;
