import React, { useState } from "react";
import {
  FaServer,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaTerminal,
  FaRobot,
  FaCog,
  FaDownload,
  FaCheck,
  FaMicrochip,
} from "react-icons/fa";
import { getOllamaInfo, pullOllamaModel, POPULAR_MODELS } from "./ollamaService";
import toast from "react-hot-toast";

const OllamaSettingsModal = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  ollamaStatus,
  onRefreshStatus,
}) => {
  const [serverUrl, setServerUrl] = useState(config.serverUrl || "/ollama-api");
  const [model, setModel] = useState(config.model || "tinyllama");
  const [mode, setMode] = useState(config.mode || "ollama"); // 'ollama' | 'smart'
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Model pulling state
  const [pullingModelName, setPullingModelName] = useState("");
  const [pullStatus, setPullStatus] = useState("");
  const [pullProgress, setPullProgress] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [customPullInput, setCustomPullInput] = useState("");

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await getOllamaInfo(serverUrl);
      setTestResult(res);
      if (res.connected && res.models?.length > 0 && !res.models.includes(model)) {
        setModel(res.models[0]);
      }
      onRefreshStatus?.();
    } catch (err) {
      setTestResult({ connected: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handlePullModel = async (targetModel) => {
    const modelToPull = (targetModel || customPullInput).trim();
    if (!modelToPull || isPulling) return;

    setIsPulling(true);
    setPullingModelName(modelToPull);
    setPullStatus("Initiating download from Ollama...");
    setPullProgress(0);

    try {
      await pullOllamaModel({
        modelName: modelToPull,
        serverUrl,
        onProgress: (data) => {
          if (data.status) {
            setPullStatus(data.status);
          }
          if (data.total && data.completed) {
            const pct = Math.round((data.completed / data.total) * 100);
            setPullProgress(pct);
          }
        },
      });

      toast.success(`Successfully pulled ${modelToPull}!`, { icon: "🎉" });
      setModel(modelToPull);
      setCustomPullInput("");
      setPullStatus("Download complete!");
      setPullProgress(100);

      // Refresh installed models
      await onRefreshStatus?.();
    } catch (err) {
      toast.error(`Pull failed: ${err.message}`);
      setPullStatus(`Error: ${err.message}`);
    } finally {
      setIsPulling(false);
      setTimeout(() => {
        setPullingModelName("");
        setPullStatus("");
      }, 4000);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      serverUrl,
      model,
      mode,
    });
    onClose();
  };

  // Helper to check if model is currently installed
  const isInstalled = (mName) => {
    if (!ollamaStatus?.models) return false;
    return ollamaStatus.models.some((m) => {
      const clean = (typeof m === "string" ? m : m.name || "").toLowerCase();
      return clean === mName.toLowerCase() || clean.startsWith(`${mName.toLowerCase()}:`);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200/80 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-2xl">
              <FaCog className="text-amber-200" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">AI Model & Store Settings</h3>
              <p className="text-xs text-amber-200/90">Select LLMs, pull new models & configure Ollama</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-xl hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-gray-700">
          {/* Mode Selector */}
          <div>
            <label className="block font-semibold text-gray-800 mb-2">Engine Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("ollama")}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                  mode === "ollama"
                    ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <FaServer className="mt-0.5 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-xs">Ollama Local AI</div>
                  <div className="text-[11px] text-gray-500">Run local LLMs via Ollama</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("smart")}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                  mode === "smart"
                    ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <FaRobot className="mt-0.5 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-xs">Store Advisor Mode</div>
                  <div className="text-[11px] text-gray-500">Instant answers + direct cart</div>
                </div>
              </button>
            </div>
          </div>

          {/* Model Selection Right */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-800">
                Active Ollama Model
              </label>
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <FaSync className={testing ? "animate-spin" : ""} size={10} />
                Refresh Installed ({ollamaStatus?.models?.length || 0})
              </button>
            </div>

            {ollamaStatus?.models?.length > 0 ? (
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs bg-white font-semibold text-gray-800"
              >
                {ollamaStatus.models.map((m) => {
                  const mName = typeof m === "string" ? m : m.name || m.model;
                  return (
                    <option key={mName} value={mName}>
                      ⚡ {mName} (Installed)
                    </option>
                  );
                })}
              </select>
            ) : (
              <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80">
                ⚠️ No models installed yet. Pull one of the recommended models below!
              </div>
            )}
          </div>

          {/* Popular Models with 1-Click Select or Pull */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <FaMicrochip className="text-amber-600" />
                Available & Popular Models:
              </span>
            </div>

            <div className="space-y-1.5">
              {POPULAR_MODELS.map((pop) => {
                const installed = isInstalled(pop.name);
                const isSelected = model === pop.name || model.startsWith(`${pop.name}:`);

                return (
                  <div
                    key={pop.name}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                      isSelected
                        ? "border-amber-600 bg-amber-50/70"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-800">{pop.label}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                          {pop.size}
                        </span>
                        {installed && (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Installed
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500">{pop.desc}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {installed ? (
                        <button
                          type="button"
                          onClick={() => setModel(pop.name)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                            isSelected
                              ? "bg-amber-600 text-white"
                              : "bg-gray-100 hover:bg-amber-100 text-gray-700"
                          }`}
                        >
                          {isSelected ? "Selected ✓" : "Select"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePullModel(pop.name)}
                          disabled={isPulling}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center gap-1 transition disabled:opacity-50"
                        >
                          <FaDownload size={10} />
                          Pull
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pull Custom Model Form */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Pull Any Custom Model
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPullInput}
                onChange={(e) => setCustomPullInput(e.target.value)}
                placeholder="e.g. gemma2:2b, qwen2.5:0.5b, mistral"
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                disabled={isPulling}
              />
              <button
                type="button"
                onClick={() => handlePullModel()}
                disabled={!customPullInput.trim() || isPulling}
                className="px-3.5 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition disabled:opacity-40"
              >
                <FaDownload size={11} />
                Pull Model
              </button>
            </div>

            {/* Pull Progress Display */}
            {isPulling && (
              <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Downloading {pullingModelName}...</span>
                  <span>{pullProgress}%</span>
                </div>
                <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${pullProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-amber-800 truncate font-mono">{pullStatus}</p>
              </div>
            )}
          </div>

          {/* Ollama Connection URL Details */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Ollama Endpoint URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="/ollama-api or http://localhost:11434"
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testing}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                >
                  {testing ? <FaSync className="animate-spin" /> : <FaServer />}
                  Test
                </button>
              </div>
            </div>

            {testResult && (
              <div className="flex items-center gap-1.5 text-xs">
                {testResult.connected ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <FaCheckCircle /> Connected ({testResult.models?.length || 0} models ready)
                  </span>
                ) : (
                  <span className="text-rose-600 font-medium flex items-center gap-1">
                    <FaTimesCircle /> Not Connected ({testResult.error || "Server offline"})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Terminal Guide */}
          <div className="bg-gray-900 text-gray-200 rounded-xl p-3 text-xs space-y-1">
            <div className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
              <FaTerminal size={11} /> Terminal Command Alternative:
            </div>
            <div className="font-mono text-[11px] text-gray-300">
              ollama run tinyllama
            </div>
            <div className="font-mono text-[11px] text-gray-300">
              ollama run llama3.2:1b
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-500">
            Active: <strong className="text-amber-800">{model}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OllamaSettingsModal;
