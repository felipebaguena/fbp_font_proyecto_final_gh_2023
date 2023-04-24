import React, { useState } from "react";
import { conversationStarters, conversationOptions } from "../../components/conversations";
import { useNavigate } from "react-router-dom";

export const StoryMode = () => {
    const navigate = useNavigate();
    const getRandomConversation = () => {
      const randomStarter = conversationStarters[Math.floor(Math.random() * conversationStarters.length)];
      return conversationOptions.find((conv) => conv.id === randomStarter.id);
    };
  
    const [currentConversation, setCurrentConversation] = useState(getRandomConversation());  

    const handleClick = (siguienteId) => {
        if (siguienteId) {
          const nextConversation = conversationOptions.find((conv) => conv.id === siguienteId);
          setCurrentConversation(nextConversation);
        } else {
          setCurrentConversation({ ...currentConversation, final: true });
        }
      };

  const handleNewConversation = () => {
    setCurrentConversation(getRandomConversation());
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div>
      {currentConversation && (
        <>
          <p>{currentConversation.texto}</p>
          {currentConversation.final ? (
            <>
              <button onClick={handleNewConversation}>Nueva conversación</button>
              <button onClick={handleGoHome}>Volver al home</button>
            </>
          ) : (
            currentConversation.opciones &&
            currentConversation.opciones.map((opcion, index) => (
              <button key={index} onClick={() => handleClick(opcion.siguienteId)}>
                {opcion.texto}
              </button>
            ))
          )}
        </>
      )}
    </div>
  );
};