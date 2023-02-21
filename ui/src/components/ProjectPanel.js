import { AppStatus } from "../App";

function ProjectPanel({
  canFinishDrawing,
  onDrawClear,
  onDrawDone,
  onDrawStart,
  status,
}) {
  const isDrawing = status === AppStatus.DRAWING;
  const hasFinishedDrawing = status === AppStatus.EDITING;

  const renderProjectBoundary = (
    <>
      <h2>Draw project boundary</h2>
      <p>
        Use your mouse to draw a boundary. You can drag the markers to edit the
        boundary before clicking done.
      </p>
      {canFinishDrawing ? (
        <div className="button-group">
          <button className="primary w-full shadow-none" onClick={onDrawDone}>
            Done
          </button>
          <button
            className="secondary w-full shadow-none"
            onClick={onDrawClear}
          >
            Clear
          </button>
        </div>
      ) : (
        <button
          className="primary w-full shadow-none"
          onClick={onDrawStart}
          disabled={isDrawing}
        >
          Start drawing
        </button>
      )}
    </>
  );

  const renderProjectParams = (
    <>
      <h2>Specify task splitting scheme</h2>
      <p>
        After specifying the parameters, click the generate button to create the
        task boundaries.
      </p>
      <button className="primary w-full shadow-none">Generate</button>
    </>
  );

  return (
    <section className="panel absolute top-md left-md">
      <header>
        <h1>Create a new project</h1>
        <p>Start your field mapping campaign</p>
      </header>
      <main className="flow">
        {hasFinishedDrawing ? renderProjectParams : renderProjectBoundary}
      </main>
    </section>
  );
}

export default ProjectPanel;
