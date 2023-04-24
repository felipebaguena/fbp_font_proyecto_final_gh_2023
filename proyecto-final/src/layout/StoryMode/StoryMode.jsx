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
    const [showHistory, setShowHistory] = useState(true); 
  
    const handleTalkToVillagers = () => {
        setShowHistory(false);
      };

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
      {showHistory ? (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
            est laborum.
          </p>
          <button onClick={handleGoHome}>Volver al home</button>
          <button onClick={handleTalkToVillagers}>Hablar con los aldeanos</button>
        </>
      ) : (
        currentConversation && (
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
        )
      )}
    </div>
  );
};