"use client";
import React, { useState } from "react";

interface ExpandableTextProps {
  text: string;
  previewLength?: number; // Optional: default to 100
  className?: string;     // Optional: for custom styling
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  previewLength = 100,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = text.length > previewLength;
  const displayText = isExpanded ? text : text.slice(0, previewLength);

  return (
    <p className={`text-black ${className}`}>
      {displayText}
      {shouldTruncate && !isExpanded && "... "}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#7887FF] ml-1"
        >
          {isExpanded ? "< See less" : "> See more"}
        </button>
      )}
    </p>
  );
};

export default ExpandableText;
