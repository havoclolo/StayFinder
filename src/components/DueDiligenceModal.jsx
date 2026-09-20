import React, { useState } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';

export default function DueDiligenceModal({ room, onClose }) {
  const [currentRoom, setCurrentRoom] = useState(room);
  const [uploading, setUploading] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('legal');
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'vault'

  const handleStageStatusChange = (stageKey, status) => {
    marketplaceStore.updateDueDiligenceStage(currentRoom.id, stageKey, status);
    const updated = marketplaceStore.getDueDiligenceByOfferId(currentRoom.offerId);
    if (updated) setCurrentRoom(updated);
  };

  const handleUploadDoc = (e) => {
    e.preventDefault();
    if (!docName.trim()) return;
    setUploading(true);
    setTimeout(() => {
      marketplaceStore.uploadDueDiligenceDocument(currentRoom.id, {
        name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
        type: docType,
      });
      const updated = marketplaceStore.getDueDiligenceByOfferId(currentRoom.offerId);
      if (updated) setCurrentRoom(updated);
      setDocName('');
      setUploading(false);
    }, 400);
  };

  const completedStagesCount = (currentRoom.stages || []).filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedStagesCount / (currentRoom.stages?.length || 5)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 my-8 border border-gray-100 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                PRD 5.6 · Acquisition Deal Room & Due Diligence Tracker
              </span>
              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {progressPercent}% Closed
              </span>
            </div>
            <h2 className="text-xl font-black text-gray-900 mt-2">{currentRoom.propertyTitle}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Buyer: <strong>{currentRoom.buyerName}</strong> · Seller: <strong>{currentRoom.sellerName}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 font-bold mt-1.5">
            <span>Offer Accepted</span>
            <span>Inspection</span>
            <span>Title Search</span>
            <span>Financing</span>
            <span>Deed Transfer & Handover</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('milestones')}
            className={`pb-2 text-xs font-bold transition border-b-2 px-3 ${
              activeTab === 'milestones'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Due Diligence Stages ({completedStagesCount}/{currentRoom.stages?.length || 5})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vault')}
            className={`pb-2 text-xs font-bold transition border-b-2 px-3 ${
              activeTab === 'vault'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Scoped Document Vault ({currentRoom.documents?.length || 0})
          </button>
        </div>

        {/* Tab 1: Stages Tracker */}
        {activeTab === 'milestones' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {currentRoom.stages?.map((stage, idx) => {
              const isDone = stage.status === 'completed';
              const isInProg = stage.status === 'in_progress';

              return (
                <div
                  key={stage.stageKey}
                  className={`p-4 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : isInProg
                      ? 'bg-blue-50/60 border-blue-200 shadow-sm'
                      : 'bg-gray-50 border-gray-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isInProg
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900">{stage.title}</h4>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{stage.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-semibold">
                          <span>Responsible: <strong className="text-gray-700">{stage.assignedTo}</strong></span>
                          {stage.completedAt && <span className="text-emerald-700 font-bold">Completed {stage.completedAt}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Action toggles */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <select
                        value={stage.status}
                        onChange={(e) => handleStageStatusChange(stage.stageKey, e.target.value)}
                        className="text-xs font-bold rounded-xl border border-gray-300 bg-white px-2.5 py-1.5 shadow-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed ✓</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Document Vault */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900">
              🔒 <strong>Encrypted Scoped Access:</strong> Only buyer, seller, and their verified conveyancing agents can access or upload to this transaction vault.
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentRoom.documents?.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-xs transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📄</span>
                    <div>
                      <p className="font-bold text-gray-900">{doc.name}</p>
                      <p className="text-[10px] text-gray-500">
                        Uploaded by {doc.uploadedBy} · {doc.date} · {doc.size}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Simulated download of ${doc.name}`)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 text-[11px]"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>

            {/* Upload document subform */}
            <form onSubmit={handleUploadDoc} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mt-4 space-y-3">
              <p className="text-xs font-bold text-gray-800">Upload Transaction Document</p>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Document title (e.g. Alausa_Search_Report)"
                  className="col-span-2 text-xs rounded-xl border border-gray-300 px-3 py-2"
                />
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="text-xs rounded-xl border border-gray-300 px-2 py-2"
                >
                  <option value="legal">Title / Legal</option>
                  <option value="survey">Survey Plan</option>
                  <option value="inspection">Inspection Report</option>
                  <option value="financial">Proof of Escrow</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
              >
                {uploading ? 'Encrypting & Uploading...' : 'Upload Document to Deal Vault'}
              </button>
            </form>
          </div>
        )}

        <div className="flex justify-end pt-5 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition"
          >
            Close Deal Room
          </button>
        </div>
      </div>
    </div>
  );
}
