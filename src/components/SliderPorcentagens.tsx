// src/components/SliderComLock.tsx


type TipoCarne = 'bovina' | 'frango' | 'suina' | 'linguica';

interface CarneEstado {
  porcentagem: number;
  locked: boolean;
}

interface Props {
  carnesSelecionadas: TipoCarne[];
  estadoPorcentagens: Record<TipoCarne, CarneEstado>;
  setEstadoPorcentagens: (p: Record<TipoCarne, CarneEstado>) => void;
  pessoas: number;
  precos: Record<TipoCarne, number | undefined>;
  nivelApetite: 'leve' | 'medio' | 'pesado';
  avancar: () => void;
  voltar: () => void;
}

const nomesCarnes: Record<TipoCarne, string> = {
  bovina: 'Carne Bovina',
  frango: 'Frango',
  suina: 'Carne Suína',
  linguica: 'Linguiça',
};

const gramasPorPessoaMap = {
  leve: 300,
  medio: 400,
  pesado: 500,
};

export default function SliderComLock({
  carnesSelecionadas,
  estadoPorcentagens,
  setEstadoPorcentagens,
  pessoas,
  precos,
  nivelApetite,
  avancar,
  voltar,
}: Props) {
  const totalPorPessoa = gramasPorPessoaMap[nivelApetite];

  const somaLocked = carnesSelecionadas.reduce(
    (acc, tipo) => acc + (estadoPorcentagens[tipo]?.locked ? estadoPorcentagens[tipo].porcentagem : 0),
    0
  );

  const onChangeValor = (tipoAlterado: TipoCarne, novoValor: number) => {
    novoValor = Math.min(100, Math.max(0, novoValor));
    if (estadoPorcentagens[tipoAlterado].locked) return;

    const desbloqueados = carnesSelecionadas.filter(
      (t) => !estadoPorcentagens[t].locked && t !== tipoAlterado
    );
    const somaDesbloqueados = desbloqueados.reduce((acc, t) => acc + estadoPorcentagens[t].porcentagem, 0);

    const restante = 100 - somaLocked - novoValor;

    let novosEstado = { ...estadoPorcentagens, [tipoAlterado]: { porcentagem: novoValor, locked: false } };

    if (desbloqueados.length === 0) {
      setEstadoPorcentagens(novosEstado);
      return;
    }

    desbloqueados.forEach((t) => {
      const proporcao =
        somaDesbloqueados === 0
          ? 1 / desbloqueados.length
          : estadoPorcentagens[t].porcentagem / somaDesbloqueados;
      novosEstado[t] = { porcentagem: proporcao * restante, locked: false };
    });

    setEstadoPorcentagens(novosEstado);
  };

  const onToggleLock = (tipo: TipoCarne) => {
    const atual = estadoPorcentagens[tipo];
    const novoLock = !atual.locked;

    let novosEstado = { ...estadoPorcentagens, [tipo]: { ...atual, locked: novoLock } };

    if (novoLock) {
      const somaLockedNovo = carnesSelecionadas.reduce(
        (acc, t) => acc + (novosEstado[t].locked ? novosEstado[t].porcentagem : 0),
        0
      );
      const desbloqueados = carnesSelecionadas.filter((t) => !novosEstado[t].locked);
      const somaDesbloqueados = desbloqueados.reduce((acc, t) => acc + novosEstado[t].porcentagem, 0);
      const restante = 100 - somaLockedNovo;

      desbloqueados.forEach((t) => {
        const proporcao =
          somaDesbloqueados === 0
            ? 1 / desbloqueados.length
            : novosEstado[t].porcentagem / somaDesbloqueados;
        novosEstado[t] = { porcentagem: proporcao * restante, locked: false };
      });
    }

    setEstadoPorcentagens(novosEstado);
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '40px auto',
        padding: 24,
        backgroundColor: '#f7f9fc',
        borderRadius: 12,
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#222',
      }}
    >
      <h2 style={{ marginBottom: 24, textAlign: 'center', color: '#1e3a8a' }}>
        Distribua as carnes (total 100%)
      </h2>

      {carnesSelecionadas.map((tipo) => {
        const { porcentagem, locked } = estadoPorcentagens[tipo] || {
          porcentagem: 0,
          locked: false,
        };
        const kg = (porcentagem / 100) * (totalPorPessoa / 1000) * pessoas;
        const preco = precos[tipo] ?? 0;
        const custo = preco * kg;

        return (
          <div
            key={tipo}
            style={{
              marginBottom: 20,
              backgroundColor: '#e0e7ff',
              borderRadius: 10,
              padding: 16,
              boxShadow: '0 0 10px rgba(67, 56, 202, 0.15)',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
                fontWeight: '700',
                color: '#1e293b',
              }}
            >
              {nomesCarnes[tipo]}
              <input
                type="checkbox"
                checked={locked}
                onChange={() => onToggleLock(tipo)}
                title={locked ? 'Destravar' : 'Travar'}
                style={{ marginLeft: 10, cursor: 'pointer', width: 18, height: 18 }}
              />
            </label>

            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={porcentagem}
              disabled={locked}
              onChange={(e) => onChangeValor(tipo, Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#4338ca',
                cursor: locked ? 'not-allowed' : 'pointer',
              }}
            />

            <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={porcentagem}
                disabled={locked}
                onChange={(e) => onChangeValor(tipo, Number(e.target.value))}
                style={{
                    width: 80,
                    marginTop: 10,
                    padding: '6px 8px',
                    fontSize: 16,
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1', // cinza claro
                    backgroundColor: '#f9fafb', // quase branco, clarinho
                    color: '#1e293b', // texto escuro para contraste
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)', // leve profundidade interna
                }}
                />

            <p style={{ marginTop: 10, fontWeight: '600', color: '#374151' }}>
              {porcentagem.toFixed(1)}% — {kg.toFixed(3)} kg — R$ {custo.toFixed(2)}
            </p>
          </div>
        );
      })}

      <p
        style={{
          fontWeight: '700',
          fontSize: 18,
          color: '#1e3a8a',
          textAlign: 'right',
          marginTop: 10,
          marginBottom: 24,
        }}
      >
        Total:{' '}
        {carnesSelecionadas
          .reduce((acc, tipo) => acc + (estadoPorcentagens[tipo]?.porcentagem ?? 0), 0)
          .toFixed(1)}
        %
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={voltar}
          style={{
            flex: 1,
            marginRight: 10,
            padding: '12px 0',
            fontSize: 16,
            fontWeight: '600',
            backgroundColor: '#e0e7ff',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            color: '#4338ca',
            boxShadow: '0 0 8px rgba(67, 56, 202, 0.3)',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c7d2fe')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e0e7ff')}
        >
          Voltar
        </button>

        <button
          onClick={() => {
            const soma = carnesSelecionadas.reduce(
              (acc, tipo) => acc + (estadoPorcentagens[tipo]?.porcentagem ?? 0),
              0
            );
            if (Math.abs(soma - 100) > 0.1) {
              alert('A soma das porcentagens deve ser 100%');
            } else {
              avancar();
            }
          }}
          style={{
            flex: 1,
            marginLeft: 10,
            padding: '12px 0',
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
            backgroundColor: '#4338ca',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(67, 56, 202, 0.6)',
            transition: 'background-color 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#312e81')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
