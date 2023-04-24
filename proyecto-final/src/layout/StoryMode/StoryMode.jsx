import React, { useEffect, useState } from "react";
import "./StoryMode.css";
import {
  conversationStarters,
  conversationOptions,
} from "../../components/conversations";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getVillagerImageById } from "../../services/apiCalls";

export const StoryMode = () => {
  const [villagerData, setVillagerData] = useState({ image_url: "", name: "" });

  const navigate = useNavigate();

  const getRandomConversation = () => {
    const randomStarter =
      conversationStarters[
        Math.floor(Math.random() * conversationStarters.length)
      ];
    return conversationOptions.find((conv) => conv.id === randomStarter.id);
  };

  const [currentConversation, setCurrentConversation] = useState(
    getRandomConversation()
  );
  const [showHistory, setShowHistory] = useState(true);

  const handleTalkToVillagers = () => {
    setShowHistory(false);
  };

  const fetchVillagerImage = async () => {
    const imageId = Math.floor(Math.random() * 49) + 1;
    const result = await getVillagerImageById(imageId);
    if (result.status === "success") {
      setVillagerData(result.data);
    }
  };

  useEffect(() => {
    fetchVillagerImage();
  }, []);

  const handleClick = (siguienteId) => {
    if (siguienteId) {
      const nextConversation = conversationOptions.find(
        (conv) => conv.id === siguienteId
      );
      setCurrentConversation(nextConversation);
    } else {
      setCurrentConversation({ ...currentConversation, final: true });
    }
  };

  const handleNewConversation = () => {
    setCurrentConversation(getRandomConversation());
    fetchVillagerImage();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container>
      {showHistory ? (
        <Row className="d-flex justify-content-center conversation-container ">
          <Col
            md={10}
            lg={8}
            xs={12}
            className="custom-text-container conversation-text-container conversation-image-container d-flex flex-column"
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="conversation-options" onClick={handleGoHome}>
              Volver al home
            </div>
            <div
              className="conversation-options"
              onClick={handleTalkToVillagers}
            >
              Hablar con los aldeanos
            </div>
          </Col>
        </Row>
      ) : (
        currentConversation && (
          <>
            <Row className="d-flex justify-content-center conversation-container ">
              <Col
                md={4}
                lg={3}
                xs={12}
                className="custom-text-container conversation-text-container conversation-image-container d-flex justify-content-center"
              >
                <div style={{ overflow: "hidden" }}>
                  <img
                    src={villagerData.image_url}
                    alt={villagerData.name}
                    style={{ height: "12rem", objectFit: "cover" }}
                  />
                </div>
              </Col>
              <Col
                md={7}
                xs={12}
                className="custom-text-container conversation-text-container d-flex flex-column justify-content-between"
              >
                <p>
                  <strong>{villagerData.name}:</strong>{" "}
                  {currentConversation.texto}
                </p>
                {currentConversation.final ? (
                  <div className="d-flex flex-column">
                    <div
                      className="conversation-options"
                      onClick={handleNewConversation}
                    >
                      Nueva conversación
                    </div>
                    <div
                      className="conversation-options"
                      onClick={handleGoHome}
                    >
                      Volver al home
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column">
                    {currentConversation.opciones &&
                      currentConversation.opciones.map((opcion, index) => (
                        <div
                          className="conversation-options"
                          key={index}
                          onClick={() => handleClick(opcion.siguienteId)}
                        >
                          {opcion.texto}
                        </div>
                      ))}
                  </div>
                )}
              </Col>
            </Row>
          </>
        )
      )}
    </Container>
  );
};
