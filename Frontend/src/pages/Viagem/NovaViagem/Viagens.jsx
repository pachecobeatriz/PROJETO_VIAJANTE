import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormularioViagem from "../../../components/Viagem/FormularioViagem";
import CardViagem from "../../../components/Viagem/CardViagem";
import "./Viagens.css";
import CEP from "../../../components/Viagem/CEP";
import ToastGeral from "../../../components/Toast/ToastGeral";

const Viagens = () => {
  const [viagens, setViagens] = useState([]);
  const [mostraForm, setMostraForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoDataPartida, setNovoDataPartida] = useState("");
  const [novoDataChegada, setNovoDataChegada] = useState("");
  const [novoCep, setNovoCep] = useState("");
  const [novoCidade, setNovoCidade] = useState("");
  const [novoEstado, setNovoEstado] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    if (!usuario) return;
    fetch(`http://localhost:8080/viagem/usuario/${usuario.id}`)
      .then((res) => (res.status === 204 ? [] : res.json()))
      .then((data) => setViagens(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const limparForm = () => {
    setNovoTitulo("");
    setNovoDataPartida("");
    setNovoDataChegada("");
    setNovoCep("");
    setNovoCidade("");
    setNovoEstado("");
  };

  const abrirForm = () => {
    limparForm();
    setEditandoId(null);
    setMostraForm(true);
  };

  const fecharForm = () => {
    limparForm();
    setEditandoId(null);
    setMostraForm(false);
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value;
    setNovoCep(cep);
    if (cep.replace(/\D/g, "").length === 8) {
      const { cidade, estado } = await CEP(cep);
      setNovoCidade(cidade);
      setNovoEstado(estado);
    } else {
      setNovoCidade("");
      setNovoEstado("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuario) return toast.error("Usuário não logado.");

    if (!novoDataPartida || !novoDataChegada)
      return toast.error("Datas de partida e chegada são obrigatórias.");

    const hoje = new Date().toISOString().split("T")[0];
    if (novoDataPartida < hoje || novoDataChegada < hoje)
      return toast.error("Datas não podem ser no passado.");
    if (novoDataChegada < novoDataPartida)
      return toast.error("Chegada não pode ser antes da partida.");

    const viagemDados = {
      titulo: novoTitulo,
      dataPartida: novoDataPartida,
      dataChegada: novoDataChegada,
      cidade: novoCidade,
      estado: novoEstado,
      cep: novoCep,
      usuarioId: usuario.id,
    };

    const url = editandoId
      ? `http://localhost:8080/viagem/${editandoId}/usuario/${usuario.id}`
      : "http://localhost:8080/viagem";
    const metodo = editandoId ? "PUT" : "POST";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(viagemDados),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (editandoId) {
          setViagens((prev) =>
            prev.map((v) => (v.id === editandoId ? data : v))
          );
          toast.success("Viagem atualizada!");
        } else {
          setViagens((prev) => [...prev, data]);
          toast.success("Viagem cadastrada!");
        }
        fecharForm();
      })
      .catch(() =>
        toast.error(
          editandoId ? "Erro ao editar viagem." : "Erro ao cadastrar viagem."
        )
      );
  };

  const handleEditar = (viagem) => {
    setNovoTitulo(viagem.titulo);
    setNovoDataPartida(viagem.dataPartida);
    setNovoDataChegada(viagem.dataChegada);
    setNovoCep(viagem.cep);
    setNovoCidade(viagem.cidade);
    setNovoEstado(viagem.estado);
    setEditandoId(viagem.id);
    setMostraForm(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Deseja realmente excluir esta viagem?")) {
      fetch(`http://localhost:8080/viagem/${id}`, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao excluir viagem!");
          setViagens((prev) => prev.filter((v) => v.id !== id));
          toast.success("Viagem excluída!");
        })
        .catch(() => toast.error("Erro ao excluir viagem."));
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1rem" }}>
      <ToastGeral />

      <div className="titulo_e_mais">
        <h2 className="titulo-principal">Minhas viagens</h2>
        <button
          onClick={abrirForm}
          className="btn-nova-viagem"
          aria-label="Nova viagem"
        >
          +
        </button>
      </div>

      {mostraForm && (
        <FormularioViagem
          titulo={novoTitulo}
          dataPartida={novoDataPartida}
          dataChegada={novoDataChegada}
          cep={novoCep}
          cidade={novoCidade}
          estado={novoEstado}
          onTituloChange={(e) => setNovoTitulo(e.target.value)}
          onDataPartidaChange={(e) => setNovoDataPartida(e.target.value)}
          onDataChegadaChange={(e) => setNovoDataChegada(e.target.value)}
          onCepChange={handleCepChange}
          onCidadeChange={(e) => setNovoCidade(e.target.value)}
          onEstadoChange={(e) => setNovoEstado(e.target.value)}
          onSubmit={handleSubmit}
          onCancelar={fecharForm}
          editando={!!editandoId}
        />
      )}

      <div className="lista-viagens">
        {viagens.length === 0 ? (
          <p className="sem-viagens">Nenhuma viagem cadastrada.</p>
        ) : (
          viagens.map((v) => (
            <CardViagem
              key={v.id}
              viagem={v}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Viagens;
