const CEP = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) return { cidade: "", estado: "" };

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await res.json();
    if (data.erro) return { cidade: "", estado: "" };
    return { cidade: data.localidade, estado: data.uf };
  } catch {
    return { cidade: "", estado: "" };
  }
};

export default CEP;
