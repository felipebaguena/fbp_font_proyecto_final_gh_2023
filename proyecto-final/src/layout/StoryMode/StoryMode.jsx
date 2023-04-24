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
  const [textIndex, setTextIndex] = useState(0);
  const [historyCompleted, setHistoryCompleted] = useState(false);

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

  const displayText = (text) => {
    if (historyCompleted) {
      return text;
    } else {
      return text.slice(0, textIndex);
    }
  };

  const handleHistoryClick = () => {
    setHistoryCompleted(true);
  };

  const displayTextWithBreaks = (text) => {
    const lines = text.split("\n");
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  useEffect(() => {
    if (
      showHistory &&
      textIndex <
        "Hace siglos, en tierras donde la bruma y las sombras bailaban al compás del viento, se encontraba la aldea de Ravenhollow. Un pequeño asentamiento, enclavado entre montañas escarpadas y bosques oscuros, que fue testigo de eventos que dejaron una cicatriz en la historia de estas tierras.\n\nRavenhollow fue fundada por los descendientes de Zalthoria, un reino cuyos muros sucumbieron ante una implacable horda de criaturas surgidas de las profundidades de la tierra. La destrucción de Zalthoria marcó el inicio de una era sombría, en la que las criaturas de la noche se adueñaron de la región, convirtiéndola en un lugar inhóspito y peligroso.\n\nLos supervivientes de Zalthoria se establecieron en Ravenhollow con la esperanza de encontrar refugio y reconstruir sus vidas. Sin embargo, la aldea pronto se convirtió en un lugar muy diferente. Un lugar maldito. Cada noche, seres grotescos y aterradores emergen de la oscuridad para acechar a los aldeanos. Los gritos de terror y las lágrimas de dolor se convirtieron en el lamento común de aquellos que habitaban en la aldea.\n\nLos problemas de Ravenhollow interesaron a numerosos héroes forasteros, atraídos por la promesa de gloria y riqueza, viajando a la aldea con la esperanza de liberarla de su maldición. Pero a medida que pasaba el tiempo, los guerreros se esfumaban y su fugaz recuerdo quedaba manchado por toda clase de acusaciones.\n\nUn día, una figura encapuchada llegó a Ravenhollow. Conocido únicamente como el Errante, este individuo comenzó a investigar los secretos ocultos tras la maldición de la aldea. La causa de la desgracia parecía tener que ver con un antiguo artefacto, el Ojo de la Noche, que había sido desenterrado durante la caída de Zalthoria.\n\nEl Errante, decidido a poner fin a la maldición, se adentró en las profundidades de los bosques oscuros en busca del Ojo de la Noche. Después de enfrentarse a innumerables horrores y desafíos, logró encontrar el artefacto y, en un acto de sacrificio, lo destruyó.\n\nSin embargo, la oscuridad que acechaba a Ravenhollow no desapareció por completo. Las criaturas de la noche aún merodeaban por bosques y montañas, y los susurros de antiguos secretos y traiciones siguen resonando en cada sombra."
          .length
    ) {
      const interval = setInterval(() => {
        setTextIndex((prevIndex) => prevIndex + 1);
      }, 60);
      return () => clearInterval(interval);
    }
  }, [showHistory, textIndex]);

  return (
    <Container fluid>
      {showHistory ? (
        <Row className="d-flex justify-content-center conversation-container ">
          <div className="selector-hero-title">La historia de Ravenhollow</div>
          <Col
            md={10}
            lg={8}
            xs={12}
            className="custom-text-container conversation-text-container conversation-image-container d-flex flex-column"
            onClick={handleHistoryClick}
          >
            <p>
              {displayTextWithBreaks(
                displayText(
                  "Hace siglos, en tierras donde la bruma y las sombras bailaban al compás del viento, se encontraba la aldea de Ravenhollow. Un pequeño asentamiento, enclavado entre montañas escarpadas y bosques oscuros, que fue testigo de eventos que dejaron una cicatriz en la historia de estas tierras.\n\nRavenhollow fue fundada por los descendientes de Zalthoria, un reino cuyos muros sucumbieron ante una implacable horda de criaturas surgidas de las profundidades de la tierra. La destrucción de Zalthoria marcó el inicio de una era sombría, en la que las criaturas de la noche se adueñaron de la región, convirtiéndola en un lugar inhóspito y peligroso.\n\nLos supervivientes de Zalthoria se establecieron en Ravenhollow con la esperanza de encontrar refugio y reconstruir sus vidas. Sin embargo, la aldea pronto se convirtió en un lugar muy diferente. Un lugar maldito. Cada noche, seres grotescos y aterradores emergen de la oscuridad para acechar a los aldeanos. Los gritos de terror y las lágrimas de dolor se convirtieron en el lamento común de aquellos que habitaban en la aldea.\n\nLos problemas de Ravenhollow interesaron a numerosos héroes forasteros, atraídos por la promesa de gloria y riqueza, viajando a la aldea con la esperanza de liberarla de su maldición. Pero a medida que pasaba el tiempo, los guerreros se esfumaban y su fugaz recuerdo quedaba manchado por toda clase de acusaciones.\n\nUn día, una figura encapuchada llegó a Ravenhollow. Conocido únicamente como el Errante, este individuo comenzó a investigar los secretos ocultos tras la maldición de la aldea. La causa de la desgracia parecía tener que ver con un antiguo artefacto, el Ojo de la Noche, que había sido desenterrado durante la caída de Zalthoria.\n\nEl Errante, decidido a poner fin a la maldición, se adentró en las profundidades de los bosques oscuros en busca del Ojo de la Noche. Después de enfrentarse a innumerables horrores y desafíos, logró encontrar el artefacto y, en un acto de sacrificio, lo destruyó.\n\nSin embargo, la oscuridad que acechaba a Ravenhollow no desapareció por completo. Las criaturas de la noche aún merodeaban por bosques y montañas, y los susurros de antiguos secretos y traiciones siguen resonando en cada sombra."
                )
              )}
            </p>
            <div
              className="conversation-options talk-villager-button"
              onClick={handleTalkToVillagers}
            >
              Hablar con los aldeanos
            </div>
            <div className="conversation-options" onClick={handleGoHome}>
              Volver al home
            </div>
          </Col>
        </Row>
      ) : (
        currentConversation && (
          <>
            <Row className="d-flex justify-content-center conversation-container ">
              <div className="selector-hero-title">En la aldea</div>
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
                      className="conversation-options talk-villager-button"
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
