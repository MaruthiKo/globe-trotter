import React, { useState } from 'react';
import '../styles/Share.css';
import html2canvas from 'html2canvas';

function Share({ username, score }) {
  const [showPopup, setShowPopup] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  const [shareLink, setShareLink] = useState('');
  
  const generateShareContent = async () => {
    // Create a share panel element
    const sharePanel = document.createElement('div');
    sharePanel.className = 'share-panel';
    sharePanel.innerHTML = `
      <div style="background: linear-gradient(135deg, #3498db, #8e44ad); padding: 20px; border-radius: 10px; color: white; font-family: Arial; width: 300px; text-align: center;">
        <h2 style="margin: 0 0 10px;">🌎 Globetrotter Challenge 🌍</h2>
        <p style="margin: 0 0 15px; font-size: 16px;">${username} has challenged you!</p>
        <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 10px; margin-bottom: 15px;">
          <p style="margin: 0; font-size: 14px;">Their Score: ${score.correct} correct / ${score.incorrect} incorrect</p>
          <p style="margin: 5px 0 0; font-weight: bold; font-size: 18px;">Can you beat it?</p>
        </div>
        <p style="margin: 0; font-size: 12px;">Tap the link to accept the challenge!</p>
      </div>
    `;
    
    document.body.appendChild(sharePanel);
    
    try {
      const canvas = await html2canvas(sharePanel);
      const imageUrl = canvas.toDataURL('image/png');
      setShareImage(imageUrl);
      
      // In a real app, this would be a unique URL with the username embedded
      setShareLink(`${window.location.origin}?challenge=${username}`);
    } finally {
      document.body.removeChild(sharePanel);
    }
    
    setShowPopup(true);
  };
  
  const shareToWhatsApp = () => {
    // In a real implementation, you would upload the image to a server and get a shareable URL
    const text = `I've challenged you to the Globetrotter Challenge! Can you beat my score of ${score.correct} correct answers? Play here: ${shareLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
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
              <button onClick={() => navigator.clipboard.writeText(shareLink)}>
                Copy
              </button>
            </div>
            
            <button className="whatsapp-button" onClick={shareToWhatsApp}>
              Share on WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Share;