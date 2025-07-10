type TipoCarne = 'bovina' | 'frango' | 'suina' | 'linguica';

interface Props {
  pessoas: string;  // agora string pra poder ficar vazio
  setPessoas: (num: string) => void;
  carnesSelecionadas: TipoCarne[];
  setCarnesSelecionadas: (carnes: TipoCarne[]) => void;
  nivelApetite: 'leve' | 'medio' | 'pesado';
  setNivelApetite: (nivel: 'leve' | 'medio' | 'pesado') => void;
  avancar: () => void;
}

const carnes = [
  { tipo: 'bovina' as TipoCarne, nome: 'Carne Bovina' },
  { tipo: 'frango' as TipoCarne, nome: 'Frango' },
  { tipo: 'suina' as TipoCarne, nome: 'Carne Suína' },
  { tipo: 'linguica' as TipoCarne, nome: 'Linguiça' },
];

export default function Inicio({
  pessoas,
  setPessoas,
  carnesSelecionadas,
  setCarnesSelecionadas,
  nivelApetite,
  setNivelApetite,
  avancar,
}: Props) {
  const toggleCarne = (tipo: TipoCarne) => {
    if (carnesSelecionadas.includes(tipo)) {
      setCarnesSelecionadas(carnesSelecionadas.filter((c) => c !== tipo));
    } else {
      setCarnesSelecionadas([...carnesSelecionadas, tipo]);
    }
  };

  // Pode avançar se pessoas tem número válido e carnes selecionadas > 0
  const podeAvancar =
    pessoas !== '' &&
    /^[1-9][0-9]*$/.test(pessoas) &&
    carnesSelecionadas.length > 0;

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
      <h1
        style={{
          marginBottom: 24,
          textAlign: 'center',
          color: '#1e3a8a',
        }}
      >
        Calculadora de Churrasco
      </h1>

      <label
        htmlFor="inputPessoas"
        style={{
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 8,
          display: 'block',
        }}
      >
        Quantas pessoas vão no churrasco?
      </label>
      <input
        id="inputPessoas"
        type="text" // TEXT para tirar seta e permitir apagar
        inputMode="numeric" // teclado numérico no celular
        value={pessoas}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '') {
            setPessoas('');
            return;
          }
          // só números inteiros positivos sem zero à esquerda
          if (/^[1-9][0-9]*$/.test(val)) {
            setPessoas(val);
          }
        }}
        placeholder="Ex: 5"
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: 18,
          borderRadius: 8,
          border: '1.5px solid #cbd5e1',
          backgroundColor: '#f9fafb',
          color: '#1e293b',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
          marginBottom: 24,
          boxSizing: 'border-box',
          transition: 'border-color 0.3s',
          // Remove seta de input number (se acaso mudar pra number)
          MozAppearance: 'textfield',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
        onBlur={(e) => (e.target.style.borderColor = '#a5b4fc')}
      />

      <h2 style={{ marginBottom: 12, color: '#374151' }}>Nível de apetite:</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {(['leve', 'medio', 'pesado'] as const).map((nivel) => (
          <button
            key={nivel}
            type="button"
            onClick={() => setNivelApetite(nivel)}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: nivelApetite === nivel ? '700' : '500',
              backgroundColor: nivelApetite === nivel ? '#4338ca' : '#e0e7ff',
              color: nivelApetite === nivel ? 'white' : '#1e293b',
              boxShadow:
                nivelApetite === nivel
                  ? '0 0 10px rgba(67, 56, 202, 0.5)'
                  : 'none',
              transition: 'all 0.3s',
            }}
          >
            {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
          </button>
        ))}
      </div>

      <h2 style={{ marginBottom: 16, color: '#374151' }}>Escolha as carnes:</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {carnes.map(({ tipo, nome }) => (
          <label
            key={tipo}
            style={{
              flex: '1 1 45%',
              backgroundColor: carnesSelecionadas.includes(tipo)
                ? '#4338ca'
                : '#e0e7ff',
              color: carnesSelecionadas.includes(tipo)
                ? 'white'
                : '#1e293b',
              padding: '12px 16px',
              borderRadius: 10,
              cursor: 'pointer',
              userSelect: 'none',
              fontWeight: '600',
              boxShadow: carnesSelecionadas.includes(tipo)
                ? '0 0 10px rgba(67, 56, 202, 0.5)'
                : 'none',
              transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
            }}
          >
            <input
              type="checkbox"
              checked={carnesSelecionadas.includes(tipo)}
              onChange={() => toggleCarne(tipo)}
              style={{ marginRight: 10, cursor: 'pointer' }}
            />
            {nome}
          </label>
        ))}
      </div>

      <button
        onClick={avancar}
        disabled={!podeAvancar}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: 18,
          fontWeight: '700',
          color: 'white',
          backgroundColor: podeAvancar ? '#4338ca' : '#a5b4fc',
          border: 'none',
          borderRadius: 10,
          cursor: podeAvancar ? 'pointer' : 'not-allowed',
          boxShadow: podeAvancar
            ? '0 4px 12px rgba(67, 56, 202, 0.6)'
            : 'none',
          transition: 'background-color 0.3s, box-shadow 0.3s',
        }}
      >
        Próxima etapa
      </button>
    </div>
  );
}
