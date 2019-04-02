import React from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Group } from 'react-konva';
import Shape from 'components/Shape';
import PhantomShape from './PhantomShape';
import Grid from './Grid';
import { themeColors } from 'utils/color';
import { TOOL_TYPES } from 'views/Project/Container';

import ProjectContextConsumer from 'views/Project/ProjectContextConsumer';
import ProjectContextProvider from 'views/Project/ProjectContextProvider';

const propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onContentClick: PropTypes.func.isRequired,
  onContentMouseMove: PropTypes.func.isRequired,
  onContentMouseDown: PropTypes.func.isRequired,

  gridDots: PropTypes.array,

  shapesList: PropTypes.array.isRequired,
  selectedShapeIndex: PropTypes.number.isRequired,
  soloedShapeIndex: PropTypes.number.isRequired,
  deletedShapeIndeces: PropTypes.array.isRequired,

  colorIndex: PropTypes.number.isRequired,

  mousePos: PropTypes.object.isRequired,
  currPoints: PropTypes.array.isRequired,

  handleShapeClick: PropTypes.func.isRequired,
  handleShapeDelete: PropTypes.func.isRequired,
  handleShapeSoloChange: PropTypes.func.isRequired,
};

function ShapeCanvasComponent(props) {
  const {
    width,
    height,
    getShapeRef,
    removeShapeRef,
    currPoints,
    snapToGrid,
    gridSize,
    mousePos,
    shapesList,
    selectedShapeIndex,
    soloedShapeIndex,
    deletedShapeIndeces,
    onContentClick,
    onContentMouseMove,
    onContentMouseDown,
    handleShapeClick,
    handleShapeDelete,
    handleShapeColorChange,
    handleShapeVolumeChange,
    handleShapeSoloChange,
    handleShapeMuteChange,
  } = props;

  /* 
    NOTE: hack to propagate context through the Konva Stage
  */
  return (
    <ProjectContextConsumer>
      {projectContext => {
        const {
          activeTool,
          isAltPressed,
          isGridActive,
          activeColorIndex,
        } = projectContext;
        const isEditMode = activeTool === TOOL_TYPES.EDIT;

        return (
          <div
            id="holder"
            style={{ cursor: isEditMode && isAltPressed && 'copy' }}
            onContextMenu={e => {
              e.preventDefault();
            }}
          >
            <Stage
              width={width}
              height={height}
              onContentClick={onContentClick}
              onContentMouseMove={onContentMouseMove}
              onContentMouseDown={onContentMouseDown}
            >
              <ProjectContextProvider value={projectContext}>
                {isGridActive && (
                  <Layer>
                    <Group>
                      <Grid width={width} height={height} gridSize={gridSize} />
                    </Group>
                  </Layer>
                )}

                <Layer>
                  <Group>
                    {shapesList.map((shape, index) => {
                      const { points, colorIndex, volume, isMuted } = shape;
                      return (
                        !deletedShapeIndeces[index] && (
                          <Shape
                            getShapeRef={getShapeRef}
                            removeShapeRef={removeShapeRef}
                            key={index}
                            index={index}
                            volume={volume}
                            isMuted={isMuted}
                            initialPoints={points}
                            isSelected={index === selectedShapeIndex}
                            soloedShapeIndex={soloedShapeIndex}
                            colorIndex={colorIndex}
                            snapToGrid={snapToGrid}
                            handleClick={handleShapeClick}
                            handleDelete={handleShapeDelete}
                            handleColorChange={handleShapeColorChange}
                            handleVolumeChange={handleShapeVolumeChange}
                            handleSoloChange={handleShapeSoloChange}
                            handleMuteChange={handleShapeMuteChange}
                          />
                        )
                      );
                    })}
                  </Group>
                </Layer>

                <Layer>
                  <PhantomShape
                    mousePos={mousePos}
                    points={currPoints}
                    color={themeColors[activeColorIndex]}
                  />
                </Layer>
              </ProjectContextProvider>
            </Stage>
          </div>
        );
      }}
    </ProjectContextConsumer>
  );
}

ShapeCanvasComponent.propTypes = propTypes;

export default ShapeCanvasComponent;
