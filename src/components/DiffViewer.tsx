import { diffLines, diffWords } from "diff";

export type DiffRow = {
  leftLineNo: number | null;
  rightLineNo: number | null;
  leftText: string | null;
  rightText: string | null;
  type: "context" | "added" | "removed" | "changed";
};

export const DiffMethod = {
  WORDS: "words",
  LINES: "lines",
} as const;

export type DiffMethodType = (typeof DiffMethod)[keyof typeof DiffMethod];

function splitLines(value: string) {
  const lines = value.split("\n");
  if (lines.length && lines[lines.length - 1] === "") {
    lines.pop();
  }
  return lines;
}

function toRows(oldText: string, newText: string): DiffRow[] {
  const parts = diffLines(oldText, newText);
  const rows: DiffRow[] = [];
  let leftNo = 1;
  let rightNo = 1;

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    if (part.removed && parts[i + 1]?.added) {
      const removedLines = splitLines(part.value);
      const addedLines = splitLines(parts[i + 1].value);
      const max = Math.max(removedLines.length, addedLines.length);
      for (let j = 0; j < max; j += 1) {
        const left = removedLines[j] ?? null;
        const right = addedLines[j] ?? null;
        rows.push({
          leftLineNo: left ? leftNo++ : null,
          rightLineNo: right ? rightNo++ : null,
          leftText: left,
          rightText: right,
          type: left && right ? "changed" : left ? "removed" : "added",
        });
      }
      i += 1;
      continue;
    }

    const lines = splitLines(part.value);
    if (part.added) {
      for (const line of lines) {
        rows.push({
          leftLineNo: null,
          rightLineNo: rightNo++,
          leftText: null,
          rightText: line,
          type: "added",
        });
      }
      continue;
    }

    if (part.removed) {
      for (const line of lines) {
        rows.push({
          leftLineNo: leftNo++,
          rightLineNo: null,
          leftText: line,
          rightText: null,
          type: "removed",
        });
      }
      continue;
    }

    for (const line of lines) {
      rows.push({
        leftLineNo: leftNo++,
        rightLineNo: rightNo++,
        leftText: line,
        rightText: line,
        type: "context",
      });
    }
  }

  return rows;
}

export default function DiffViewer({
  oldText,
  newText,
  splitView,
  compareMethod = DiffMethod.LINES,
}: {
  oldText: string;
  newText: string;
  splitView: boolean;
  compareMethod?: DiffMethodType;
}) {
  const rows = toRows(oldText, newText);

  const renderWordDiff = (
    left: string,
    right: string,
    side: "left" | "right",
  ) => {
    const parts = diffWords(left, right);
    return parts
      .filter((part) => {
        if (side === "left") {
          return !part.added;
        }
        return !part.removed;
      })
      .map((part, idx) => {
        const className = part.added
          ? "word-added"
          : part.removed
            ? "word-removed"
            : "word-plain";
        return (
          <span key={idx} className={className}>
            {part.value}
          </span>
        );
      });
  };

  if (splitView) {
    return (
      <table className="diff-table">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className={`row-${row.type}`}>
              <td className="line-no">{row.leftLineNo ?? ""}</td>
              <td className={`cell left ${row.leftText ? "" : "empty"}`}>
                {compareMethod === DiffMethod.WORDS &&
                row.leftText &&
                row.rightText
                  ? renderWordDiff(row.leftText, row.rightText, "left")
                  : (row.leftText ?? "")}
              </td>
              <td className="line-no">{row.rightLineNo ?? ""}</td>
              <td className={`cell right ${row.rightText ? "" : "empty"}`}>
                {compareMethod === DiffMethod.WORDS &&
                row.leftText &&
                row.rightText
                  ? renderWordDiff(row.leftText, row.rightText, "right")
                  : (row.rightText ?? "")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table className="diff-table unified">
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} className={`row-${row.type}`}>
            <td className="line-no">{row.leftLineNo ?? ""}</td>
            <td className="line-no">{row.rightLineNo ?? ""}</td>
            <td className={`cell ${row.type}`}>
              <span className="prefix">
                {row.type === "added"
                  ? "+"
                  : row.type === "removed"
                    ? "-"
                    : " "}
              </span>
              {compareMethod === DiffMethod.WORDS &&
              row.leftText &&
              row.rightText
                ? renderWordDiff(row.leftText, row.rightText, "right")
                : (row.rightText ?? row.leftText ?? "")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
