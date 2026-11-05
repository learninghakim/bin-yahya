import React from "react";
import { Composition, Folder } from "remotion";
import { VIDEO } from "./system/safeArea";
import { Reel } from "./system/Reel";
import { calculateReelMetadata } from "./system/calculateMetadata";
import { videos } from "./videos";
import * as Ex from "./examples/Examples";
import { calculateSignalMetadata, SignalReel } from "./styles/signal/SignalReel";
import { signalVideos } from "./videos/signal";
import { cinemaVideos, newsVideos, paperVideos, phoneVideos, pulseVideos, punchVideos } from "./videos/styles";
import { calculatePulseMetadata, PulseReel } from "./styles/pulse/PulseReel";
import { calculatePhoneMetadata, PhoneReel } from "./styles/phone/PhoneReel";
import { calculateCinemaMetadata, CinemaReel } from "./styles/cinema/CinemaReel";
import { calculateNewsMetadata, NewsReel } from "./styles/news/NewsReel";
import { calculatePunchMetadata, PunchReel } from "./styles/punch/PunchReel";
import { calculatePaperMetadata, PaperReel } from "./styles/paper/PaperReel";
import "./theme/fonts";

const common = { width: VIDEO.width, height: VIDEO.height, fps: VIDEO.fps } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Videos">
      {videos.map((spec) => (
        <Composition
          key={spec.id}
          id={spec.id}
          component={Reel}
          {...common}
          durationInFrames={30 * VIDEO.fps}
          defaultProps={{ spec }}
          calculateMetadata={calculateReelMetadata}
        />
      ))}
    </Folder>
    <Folder name="Signal">
      {signalVideos.map((spec) => (
        <Composition key={spec.id} id={spec.id} component={SignalReel} {...common} durationInFrames={30 * VIDEO.fps} defaultProps={{ spec }} calculateMetadata={calculateSignalMetadata} />
      ))}
    </Folder>
    <Folder name="Styles">
      {newsVideos.map((spec) => (
        <Composition key={spec.id} id={spec.id} component={NewsReel} {...common} durationInFrames={30 * VIDEO.fps} defaultProps={{ spec }} calculateMetadata={calculateNewsMetadata} />
      ))}
      {punchVideos.map((spec) => (
        <Composition key={spec.id} id={spec.id} component={PunchReel} {...common} durationInFrames={30 * VIDEO.fps} defaultProps={{ spec }} calculateMetadata={calculatePunchMetadata} />
      ))}
      {paperVideos.map((spec) => (
        <Composition key={spec.id} id={spec.id} component={PaperReel} {...common} durationInFrames={30 * VIDEO.fps} defaultProps={{ spec }} calculateMetadata={calculatePaperMetadata} />
      ))}
    </Folder>
    <Folder name="Styles-v2">
      {pulseVideos.map((spec) => (
        <Composition key={spec.id} id={spec.id} component={PulseReel} {...common} durationInFrames={30 * VIDEO.fps} defaultProps={{ spec }} calculateMetadata={calculatePulseMetadata} />
      ))}
      {phoneVideos.map((spec) => (
        <Composition key={spec.id} id={spec.id} component={PhoneReel} {...common} durationInFrames={30 * VIDEO.fps} defaultProps={{ spec }} calculateMetadata={calculatePhoneMetadata} />
      ))}
      {cinemaVideos.map((spec) => (
        <Composition key={spec.id} id={spec.id} component={CinemaReel} {...common} durationInFrames={30 * VIDEO.fps} defaultProps={{ spec }} calculateMetadata={calculateCinemaMetadata} />
      ))}
    </Folder>
    <Folder name="Examples">
      <Composition id="Ex-TextReveal" component={Ex.TextRevealExample} {...common} durationInFrames={120} />
      <Composition id="Ex-Icons" component={Ex.IconsExample} {...common} durationInFrames={90} />
      <Composition id="Ex-StaggerList" component={Ex.StaggerListExample} {...common} durationInFrames={120} />
      <Composition id="Ex-LowerThird" component={Ex.LowerThirdExample} {...common} durationInFrames={90} />
      <Composition id="Ex-CTA" component={Ex.CTAExample} {...common} durationInFrames={120} />
      <Composition id="Ex-SafeZone" component={Ex.SafeZoneExample} {...common} durationInFrames={90} />
    </Folder>
  </>
);
