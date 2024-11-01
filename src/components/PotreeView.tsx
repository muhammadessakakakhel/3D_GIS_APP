
// export default PotreeView;
import React from 'react';

const PotreeViewer = () => {
  return (
    <div>
      <iframe 
        src="http://localhost:3002/" // URL of the standalone Potree app
        style={{ width: '100%', height: '500px', border: 'none' }}
        title="3D Viewer"
      />
    </div>
  );
};

export default PotreeViewer;

