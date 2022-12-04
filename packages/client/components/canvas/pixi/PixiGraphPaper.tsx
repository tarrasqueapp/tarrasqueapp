import { GraphOptions, GraphPaper } from 'pixi-graphpaper';
import { CustomPIXIComponent } from 'react-pixi-fiber';

export const PixiGraphPaper = CustomPIXIComponent<GraphPaper, GraphOptions>(
  {
    customDisplayObject: (props) => {
      const paper = new GraphPaper({
        intermediateGridVisible: false,
        majorGridVisible: false,
        ...props,
      });
      return paper;
    },
  },
  'Grid',
);
