import React from "react";

const FormularioViagem = ({
  titulo,
  dataPartida,
  dataChegada,
  cep,
  cidade,
  estado,
  onTituloChange,
  onDataPartidaChange,
  onDataChegadaChange,
  onCepChange,
  onCidadeChange,
  onEstadoChange,
  onSubmit,
  onCancelar,
  editando
}) => (
  <form onSubmit={onSubmit} className="form-viagem">
    <input placeholder="Nome" value={titulo} onChange={onTituloChange} required />
    <small>Data de ida:</small>
    <input type="date" value={dataPartida} onChange={onDataPartidaChange} required />
    <small>Data de volta:</small>
    <input type="date" value={dataChegada} onChange={onDataChegadaChange} required />
    <input placeholder="CEP" value={cep} onChange={onCepChange} maxLength={9} required />
    <input placeholder="Cidade" value={cidade} onChange={onCidadeChange} readOnly required />
    <input placeholder="Estado" value={estado} onChange={onEstadoChange} readOnly required />

    <button type="submit">{editando ? "Salvar alterações" : "Salvar Viagem"}</button>
    <button type="button" onClick={onCancelar}>Cancelar</button>
  </form>
);

export default FormularioViagem;
