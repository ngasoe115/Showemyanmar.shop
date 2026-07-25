import React, { useState, useEffect } from 'react';
import { X, Mail, RefreshCw, KeyRound, CheckCircle, Clock } from 'lucide-react';

export const LocalMailInboxModal = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/inbox');
      const data = await res.json();
      if (data.success) {
        setEmails(data.emails || []);
        if (data.emails && data.emails.length > 0 && !selectedEmail) {
          setSelectedEmail(data.emails[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load local inbox:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInbox();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px', width: '90%' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '8px', borderRadius: '10px', display: 'flex' }}>
              <Mail size={22} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0 }}>Site Email Inbox</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sent by <strong>noreply@showemyanmar.shop</strong> via Local SMTP Mailer
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={fetchInbox} className="btn btn-secondary btn-icon" title="Refresh Inbox">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-icon">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mailbox Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px', minHeight: '400px', maxHeight: '550px' }}>
          {/* Email List Sidebar */}
          <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '12px', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Recent Sent Emails ({emails.length})
            </div>

            {emails.length === 0 ? (
              <div style={{ padding: '32px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No emails sent yet.<br />Try registering or logging in!
              </div>
            ) : (
              emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedEmail?.id === email.id ? 'var(--primary-light)' : 'transparent',
                    border: selectedEmail?.id === email.id ? '1px solid var(--primary)' : '1px solid transparent',
                    cursor: 'pointer',
                    marginBottom: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>To: {email.to}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {email.subject}
                  </div>
                  {email.code && (
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '4px' }}>
                        OTP: {email.code}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Email HTML Detail View */}
          <div style={{ overflowY: 'auto', padding: '8px' }}>
            {selectedEmail ? (
              <div>
                <div style={{ paddingBottom: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'var(--text-main)' }}>{selectedEmail.subject}</h4>
                    {selectedEmail.code && (
                      <button
                        onClick={() => copyCode(selectedEmail.code, selectedEmail.id)}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                      >
                        {copiedId === selectedEmail.id ? <CheckCircle size={14} /> : <KeyRound size={14} />}
                        {copiedId === selectedEmail.id ? 'Copied Code!' : `Copy Code ${selectedEmail.code}`}
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span><strong>From:</strong> {selectedEmail.from}</span>
                    <span><strong>To:</strong> {selectedEmail.to}</span>
                    <span><strong>Sent:</strong> {new Date(selectedEmail.sentAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Render HTML preview inside container */}
                <div
                  style={{
                    background: '#0f172a',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                Select an email from the left sidebar to view contents.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
