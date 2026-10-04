import "./index.css";
import "./fonts";
import { Composition } from "remotion";
import { StudyReel } from "./StudyReel";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="StudyReel"
      component={StudyReel}
      durationInFrames={VIDEO.durationInSeconds * VIDEO.fps}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
};
