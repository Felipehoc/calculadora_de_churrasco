import { useRef } from 'react';
import html2canvas from 'html2canvas';

type TipoCarne = 'bovina' | 'frango' | 'suina' | 'linguica';

interface Props {
  pessoas: number;
  carnesSelecionadas: TipoCarne[];
  porcentagens: Record<TipoCarne, number>;
  precos: Record<TipoCarne, number>;
  nivelApetite: 'leve' | 'medio' | 'pesado';
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

export default function Resultado({
  pessoas,
  carnesSelecionadas,
  porcentagens,
  precos,
  nivelApetite,
  voltar,
}: Props) {
  const gramasPorPessoa = gramasPorPessoaMap[nivelApetite];
  const containerRef = useRef<HTMLDivElement>(null);




  // Função para compartilhar imagem da div
  const compartilharImagem = async () => {
    if (!containerRef.current) return;

    try {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#f7f9fc',
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Erro ao gerar imagem');
          return;
        }

        const file = new File([blob], 'resultado-churrasco.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Resultado do Churrasco',
          });
        } else {
          // fallback: baixa a imagem
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'resultado-churrasco.png';
          a.click();
          URL.revokeObjectURL(url);
          alert('Seu dispositivo não suporta compartilhamento direto. A imagem foi baixada.');
        }
      });
    } catch {
      alert('Não foi possível compartilhar a imagem.');
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: 700, // Aumentei de 480 para 700 px aqui
        margin: '40px auto',
        padding: 24,
        backgroundColor: '#f7f9fc',
        borderRadius: 12,
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#222',
      }}
    >
      <h2 style={{ color: '#1e3a8a', marginBottom: 24, textAlign: 'center' }}>
        Resultado do Churrasco
      </h2>

      <div
        style={{
          backgroundColor: '#e0e7ff',
          padding: 16,
          borderRadius: 10,
          marginBottom: 24,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
          color: '#1e293b',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 16,
        }}
      >
        <div><strong>Pessoas:</strong> {pessoas}</div>
        <div><strong>Apetite:</strong> {nivelApetite.charAt(0).toUpperCase() + nivelApetite.slice(1)}</div>
        <div><strong>Gramas/pessoa:</strong> {gramasPorPessoa} g</div>
        <div><strong>Total kg:</strong> {(gramasPorPessoa * pessoas / 1000).toFixed(2)}</div>
      </div>

      {carnesSelecionadas.map((tipo) => {
        const porcentagem = porcentagens[tipo];
        const kg = ((porcentagem / 100) * pessoas * gramasPorPessoa) / 1000;
        const preco = (precos[tipo] ?? 0) * kg;

        return (
          <div
            key={tipo}
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              color: '#1e293b',
            }}
          >
            <strong style={{ fontSize: 18 }}>{nomesCarnes[tipo]}</strong>
            <p style={{ marginTop: 8, fontSize: 16 }}>
              {porcentagem.toFixed(1)}% — {kg.toFixed(2)} kg — R$ {preco.toFixed(2)}
            </p>
          </div>
        );
      })}

      <div
        style={{
          backgroundColor: '#e0e7ff',
          padding: 16,
          borderRadius: 10,
          marginTop: 24,
          fontWeight: '600',
          fontSize: 16,
          color: '#1e293b',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <p><strong>Total:</strong> {((pessoas * gramasPorPessoa) / 1000).toFixed(2)} kg</p>
        <p><strong>Custo total:</strong> R$ {carnesSelecionadas.reduce((acc, tipo) => {
          const porcentagem = porcentagens[tipo];
          const kg = ((porcentagem / 100) * pessoas * gramasPorPessoa) / 1000;
          return acc + (precos[tipo] ?? 0) * kg;
        }, 0).toFixed(2)}</p>
        <p><strong>Por pessoa:</strong> R$ {(carnesSelecionadas.reduce((acc, tipo) => {
          const porcentagem = porcentagens[tipo];
          const kg = ((porcentagem / 100) * pessoas * gramasPorPessoa) / 1000;
          return acc + (precos[tipo] ?? 0) * kg;
        }, 0) / pessoas).toFixed(2)}</p>
      </div>

      <div
        style={{
          marginTop: 32,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={voltar}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            borderRadius: 8,
            border: '2px solid #4338ca',
            backgroundColor: 'white',
            color: '#4338ca',
            cursor: 'pointer',
            fontWeight: '600',
            minWidth: 120,
            transition: 'background-color 0.3s, color 0.3s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4338ca';
            (e.currentTarget as HTMLButtonElement).style.color = 'white';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white';
            (e.currentTarget as HTMLButtonElement).style.color = '#4338ca';
          }}
        >
          Voltar
        </button>

        <button
          onClick={compartilharImagem}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            borderRadius: 8,
            border: 'none',
            backgroundColor: '#4338ca',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            minWidth: 140,
            boxShadow: '0 4px 12px rgba(67, 56, 202, 0.6)',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3730a3';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4338ca';
          }}
        >
          Compartilhar Imagem
        </button>


      </div>
    </div>
  );
}
