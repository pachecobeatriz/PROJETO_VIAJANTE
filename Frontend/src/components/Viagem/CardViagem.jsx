import React from "react";

const CardViagem = ({ viagem, onEditar, onExcluir }) => (
  <div className="viagem-card">
    <h3>{viagem.titulo}</h3>
    <p>Partida: {viagem.dataPartida}</p>
    <p>Chegada: {viagem.dataChegada}</p>
    <p>Cidade: {viagem.cidade}</p>
    <p>Estado: {viagem.estado}</p>
    <p>CEP: {viagem.cep}</p>
    <div className="acoes-card">
      <img
        src="/editar-texto.png"
        alt="Editar"
        className="icone-acao"
        onClick={() => onEditar(viagem)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onEditar(viagem)}
      />
      <img
        src="/excluir.png"
        alt="Excluir"
        className="icone-acao"
        onClick={() => onExcluir(viagem.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onExcluir(viagem.id)}
      />
    </div>
  </div>
);

export default CardViagem;
