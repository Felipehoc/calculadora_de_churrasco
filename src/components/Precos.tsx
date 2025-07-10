// src/components/Precos.tsx

import React, { useState, useEffect } from 'react';

type TipoCarne = 'bovina' | 'frango' | 'suina' | 'linguica';

interface Props {
  carnesSelecionadas: TipoCarne[];
  precos: Record<TipoCarne, number | undefined>;
  setPrecos: React.Dispatch<React.SetStateAction<Record<TipoCarne, number | undefined>>>;
  avancar: () => void;
  voltar: () => void;
}

const nomesCarnes: Record<TipoCarne, string> = {
  bovina: 'Carne Bovina',
  frango: 'Frango',
  suina: 'Carne Suína',
  linguica: 'Linguiça',
};

export default function Precos({ carnesSelecionadas, precos, setPrecos, avancar, voltar }: Props) {
  const [inputs, setInputs] = useState<Record<TipoCarne, string>>({} as any);

  useEffect(() => {
    const novosInputs: Record<TipoCarne, string> = {} as any;
    carnesSelecionadas.forEach((tipo) => {
      novosInputs[tipo] = precos[tipo]?.toString() || '';
    });
    setInputs(novosInputs);
  }, [precos, carnesSelecionadas]);

  const handleChange = (tipo: TipoCarne, valor: string) => {
    // permite números com vírgula ou ponto
    if (/^\d*[,.\d]*$/.test(valor)) {
      setInputs((prev) => ({ ...prev, [tipo]: valor }));
    }
  };

  const handleBlur = (tipo: TipoCarne) => {
    const numero = Number(inputs[tipo].replace(',', '.'));
    if (isNaN(numero) || numero <= 0) {
      // remove preço inválido
      setPrecos((prev) => {
        const copy = { ...prev };
        delete copy[tipo];
        return copy;
      });
      setInputs((prev) => ({ ...prev, [tipo]: '' }));
    } else {
      setPrecos((prev) => ({ ...prev, [tipo]: numero }));
      setInputs((prev) => ({ ...prev, [tipo]: numero.toString() }));
    }
  };

  const podeAvancar = carnesSelecionadas.every(
    (tipo) => precos[tipo] !== undefined && precos[tipo]! > 0
  );

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
        Digite o preço médio do kg para cada carne
      </h2>

      {carnesSelecionadas.map((tipo) => (
        <div
          key={tipo}
          style={{
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#e0e7ff',
            padding: '12px 16px',
            borderRadius: 10,
            boxShadow: '0 0 8px rgba(67, 56, 202, 0.15)',
          }}
        >
          <label
            htmlFor={`preco-${tipo}`}
            style={{ fontWeight: '600', color: '#1e293b', flex: 1 }}
          >
            {nomesCarnes[tipo]}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              id={`preco-${tipo}`}
              type="text"
              inputMode="decimal"
              value={inputs[tipo] ?? ''}
              onChange={(e) => handleChange(tipo, e.target.value)}
              onBlur={() => handleBlur(tipo)}
              placeholder="Ex: 25.50"
              style={{
                width: 100,
                padding: '8px 12px',
                fontSize: 16,
                borderRadius: 8,
                border: '1.5px solid #cbd5e1', // cinza claro
                backgroundColor: '#f9fafb', // quase branco, clarinho
                color: '#1e293b', // texto escuro para contraste
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)', // leve profundidade interna
                textAlign: 'right',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#a5b4fc')}
            />
            <span style={{ fontWeight: '600', color: '#4338ca' }}>R$</span>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between' }}>
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
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c7d2fe')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e0e7ff')}
        >
          Voltar
        </button>

        <button
          onClick={avancar}
          disabled={!podeAvancar}
          style={{
            flex: 1,
            marginLeft: 10,
            padding: '12px 0',
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
            backgroundColor: podeAvancar ? '#4338ca' : '#a5b4fc',
            border: 'none',
            borderRadius: 10,
            cursor: podeAvancar ? 'pointer' : 'not-allowed',
            boxShadow: podeAvancar ? '0 4px 12px rgba(67, 56, 202, 0.6)' : 'none',
            transition: 'background-color 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={e => {
            if (podeAvancar) e.currentTarget.style.backgroundColor = '#312e81';
          }}
          onMouseLeave={e => {
            if (podeAvancar) e.currentTarget.style.backgroundColor = '#4338ca';
          }}
        >
          Calcular
        </button>
      </div>
    </div>
  );
}
