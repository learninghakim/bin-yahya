import React from "react";
import { Composition } from "remotion";
import { AliAlhamedMain } from "./compositions/AliAlhamedMain";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./data/timing";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="AliAlhamedMain"
    component={AliAlhamedMain}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
