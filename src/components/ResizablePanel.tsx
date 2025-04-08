import React, { useState, useRef } from 'react';

interface ResizablePanelProps {
    children: React.ReactNode;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
    children,
}) => {
    const [leftWidth, setLeftWidth] = useState(50);
    const panelRef = useRef<HTMLDivElement | null>(null);
  
    const handleDrag = (e: MouseEvent) => {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    };
  
    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleMouseUp);
    };
  
    const handleMouseDown = () => {
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleMouseUp);
    };
  
    const [leftPanelContent, rightPanelContent] = React.Children.toArray(children);

    return (
      <div className="flex h-full gap-2">
        <div className="w-full flex flex-col gap-4"
          style={{ width: `${leftWidth}%` }}
        >
            {/* Left panel */}
            {leftPanelContent}
        </div>
        <div
          ref={panelRef}
          onMouseDown={handleMouseDown}
          className="w-1 cursor-col-resize bg-green-800 h-full"
        ></div>
        <div className="w-full h-full"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {/* Right panel */}
          {rightPanelContent}
        </div>
      </div>
    );
};

export default ResizablePanel;