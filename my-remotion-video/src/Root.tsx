import "./index.css";
import "./fonts";
import { Composition } from "remotion";
import { StudyReel } from "./clients/abdullah-almashhor/StudyReel";
import { VIDEO } from "./shared/theme";
import { Video31 } from "./clients/abdullah-almashhor/video31/Video31";
import { Video31v2 } from "./clients/abdullah-almashhor/video31v2/Video31v2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StudyReel"
        component={StudyReel}
        durationInFrames={VIDEO.durationInSeconds * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Abdullah-31"
        component={Video31}
        durationInFrames={1079}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Abdullah-31-v2"
        component={Video31v2}
        durationInFrames={1079}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
