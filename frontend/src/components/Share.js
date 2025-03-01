import React, { useState } from 'react';
import '../styles/Share.css';
import html2canvas from 'html2canvas';

function Share({ username, score }) {
  const [showPopup, setShowPopup] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  const generateShareContent = async () => {
    // Create a share panel element
    const sharePanel = document.createElement('div');
    sharePanel.className = 'share-panel';
    sharePanel.innerHTML = `
      <div style="background: white; border-radius: 16px; padding: 32px; width: 480px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);">
        <div style="background: #4285f4; border-radius: 12px; padding: 40px; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 32px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white; margin-right: 12px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span style="font-weight: 600; font-size: 28px; color: white;">Globetrotter Challenge</span>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 36px;">
            <p style="margin: 0; font-size: 22px; font-weight: 500; color: white;">${username} has challenged you!</p>
          </div>
          
          <div style="display: flex; justify-content: center; gap: 96px; margin-bottom: 36px;">
            <div style="text-align: center;">
              <div style="font-size: 48px; font-weight: 600; color: white; margin-bottom: 8px;">${score.correct}</div>
              <div style="font-size: 18px; color: rgba(255, 255, 255, 0.9);">Correct</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 48px; font-weight: 600; color: white; margin-bottom: 8px;">${score.incorrect}</div>
              <div style="font-size: 18px; color: rgba(255, 255, 255, 0.9);">Incorrect</div>
            </div>
          </div>
          
          <p style="margin: 0 0 36px; font-weight: 600; font-size: 24px; color: white;">Can you beat it?</p>
          
          <button style="background: white; color: #4285f4; font-weight: 500; padding: 16px 32px; border-radius: 9999px; border: none; width: 100%; font-size: 18px;">
            Tap the link to accept the challenge!
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(sharePanel);
    
    try {
      const canvas = await html2canvas(sharePanel);
      const imageUrl = canvas.toDataURL('image/png');
      setShareImage(imageUrl);
      
      // Create a challenge URL with the username and score
      const challengeUrl = new URL(window.location.href);
      challengeUrl.search = `?challenge=${encodeURIComponent(username)}`;
      setShareLink(challengeUrl.toString());
    } finally {
      document.body.removeChild(sharePanel);
    }
    
    setShowPopup(true);
  };
  
  const shareToWhatsApp = () => {
    const text = `I've challenged you to the Globetrotter Challenge! Can you beat my score of ${score.correct} correct answers? Play here: ${shareLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <>
      <button className="share-button" onClick={generateShareContent}>
        Challenge a Friend
      </button>
      
      {showPopup && (
        <div className="share-popup">
          <div className="share-popup-content">
            <button className="close-button" onClick={() => setShowPopup(false)}>×</button>
            <h3>Challenge a Friend</h3>
            
            {shareImage && (
              <div className="share-image-container">
                <img src={shareImage} alt="Challenge" />
              </div>
            )}
            
            <p>Share this challenge with friends:</p>
            
            <div className="share-link">
              <input type="text" value={shareLink} readOnly />
              <button onClick={copyToClipboard}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div className="share-options">
              <button className="whatsapp-button" onClick={shareToWhatsApp}>
                <i className="whatsapp-icon">📱</i> Share on WhatsApp
              </button>
              
              <button 
                className="email-button"
                onClick={() => {
                  const subject = encodeURIComponent('Globetrotter Challenge!');
                  const body = encodeURIComponent(`I've challenged you to the Globetrotter Challenge! Can you beat my score of ${score.correct} correct answers? Play here: ${shareLink}`);
                  window.location.href = `mailto:?subject=${subject}&body=${body}`;
                }}
              >
                <i className="email-icon">✉️</i> Share via Email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Share;