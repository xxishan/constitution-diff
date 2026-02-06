import { useMemo, useState } from "react";
import { currentConstitution, ldpDraft } from "../data/texts";
import DiffViewer, { DiffMethod } from "./DiffViewer";
import readme from "../../README.md?raw";

const filePath = "constitution.md";

function normalize(text: string) {
  return text.replace(/\r\n/g, "\n");
}

export default function DiffApp() {
  const [isSplit, setIsSplit] = useState(true);
  const [showInputs, setShowInputs] = useState(false);
  const [showReadme, setShowReadme] = useState(false);
  const [leftText, setLeftText] = useState(currentConstitution);
  const [rightText, setRightText] = useState(ldpDraft);
  const shareTitle = "日本国憲法改正草案（現行憲法）対照ビューワー";

  const openShare = (url: string) => {
    const width = 640;
    const height = 520;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const features = `popup=yes,width=${width},height=${height},left=${left},top=${top}`;
    const opened = window.open(url, "_blank", features);
    if (!opened) {
      window.open(url, "_blank");
    }
  };

  const shareOnX = () => {
    const targetUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareTitle);
    openShare(`https://twitter.com/intent/tweet?text=${text}&url=${targetUrl}`);
  };

  const shareOnThreads = () => {
    const targetUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareTitle);
    openShare(
      `https://www.threads.net/intent/post?text=${text}%0A${targetUrl}`,
    );
  };

  const { oldText, newText } = useMemo(() => {
    return {
      oldText: normalize(leftText),
      newText: normalize(rightText),
    };
  }, [leftText, rightText]);

  return (
    <div className="page">
      <div className="repo-bar">
        <div className="repo-title">
          jimin / <span>constitution-diff</span>
        </div>
        <div className="repo-actions">
          <button className="ghost" onClick={shareOnX}>
            Share on X
          </button>
          <button className="ghost" onClick={shareOnThreads}>
            Share on Threads
          </button>
        </div>
      </div>

      <div className="pr-tabs">
        <button className="tab">Conversation</button>
        <button className="tab" onClick={() => setShowReadme(true)}>
          Checks
        </button>
        <button className="tab active">Files changed</button>
      </div>

      <div className="page-body">
        <div className="files-header">
          <div className="files-summary">
            <span className="pill">1 changed file</span>
          </div>
          <div className="files-controls">
            <button
              className={`seg ${isSplit ? "active" : ""}`}
              onClick={() => setIsSplit(true)}
            >
              Split
            </button>
            <button
              className={`seg ${!isSplit ? "active" : ""}`}
              onClick={() => setIsSplit(false)}
            >
              Unified
            </button>
            <button
              className="ghost"
              onClick={() => setShowInputs(!showInputs)}
            >
              {showInputs ? "Hide" : "Edit"} texts
            </button>
          </div>
        </div>

        {showInputs && (
          <section className="inputs">
            <div className="input-block">
              <div className="label">現行憲法（旧）</div>
              <textarea
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
                spellCheck={false}
              />
            </div>
            <div className="input-block">
              <div className="label">自民党 改正草案（新）</div>
              <textarea
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
                spellCheck={false}
              />
            </div>
            <p className="hint">
              PDFが縦書きの場合は、本文の行順が崩れやすいので、
              差分が読みやすいように行順を整えたテキストを貼り付けてください。
            </p>
          </section>
        )}

        <section className="file-card">
          <div className="file-header">
            <div className="file-title">{filePath}</div>
            <div className="file-actions"></div>
          </div>
          <div className="diff-wrap">
            <DiffViewer
              oldText={oldText}
              newText={newText}
              splitView={isSplit}
              compareMethod={DiffMethod.WORDS}
            />
          </div>
        </section>
      </div>

      {showReadme && (
        <div className="modal-backdrop" onClick={() => setShowReadme(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">README</div>
              <button className="ghost" onClick={() => setShowReadme(false)}>
                Close
              </button>
            </div>
            <pre className="modal-body">{readme}</pre>
          </div>
        </div>
      )}
      <footer className="site-footer">
        <span>2026 developed by </span>
        <a href="https://yudainishiyama.com" target="_blank" rel="noreferrer">
          Yudai Nishiyama
        </a>
      </footer>
    </div>
  );
}
