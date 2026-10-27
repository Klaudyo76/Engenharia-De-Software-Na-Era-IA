export const CUSTOMTKINTER_CODE = `"""
Calculadora Moderna em Python (CustomTkinter)
Cores: Laranja (#FF6B00), Preto (#0D0D0D) e Branco (#FFFFFF)
Requisitos: pip install customtkinter
Execução: python calculadora_moderna.py
"""

import customtkinter as ctk
import math

class CalculadoraModerna(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Configurações da Janela
        self.title("Calculadora Python")
        self.geometry("360x520")
        self.resizable(False, False)
        
        # Paleta de Cores: Laranja, Preto e Branco
        self.COLOR_BG = "#0D0D0D"         # Preto profundo
        self.COLOR_DISPLAY_BG = "#171717" # Preto secundário
        self.COLOR_BTN_NUM = "#262626"    # Cinza escuro / Preto fosco
        self.COLOR_BTN_NUM_HOVER = "#333333"
        self.COLOR_BTN_OP = "#FF6B00"     # Laranja vibrante
        self.COLOR_BTN_OP_HOVER = "#E05E00"
        self.COLOR_BTN_SPEC = "#3A3A3A"   # Ações (C, %, ⌫)
        self.COLOR_BTN_SPEC_HOVER = "#4A4A4A"
        self.COLOR_TEXT = "#FFFFFF"       # Branco puro
        self.COLOR_SUBTEXT = "#A1A1AA"    # Branco fosco / Cinza claro

        self.configure(fg_color=self.COLOR_BG)
        ctk.set_appearance_mode("dark")

        self.expressao = ""
        self.criar_widgets()
        self.configurar_teclado()

    def criar_widgets(self):
        # Frame do Display (Visor)
        display_frame = ctk.CTkFrame(
            self, 
            fg_color=self.COLOR_DISPLAY_BG, 
            corner_radius=16,
            border_width=1,
            border_color="#2A2A2A"
        )
        display_frame.pack(padx=16, pady=(20, 16), fill="x")

        # Linha da Expressão anterior
        self.label_expressao = ctk.CTkLabel(
            display_frame,
            text="",
            font=("Plus Jakarta Sans", 14),
            text_color=self.COLOR_SUBTEXT,
            anchor="e"
        )
        self.label_expressao.pack(padx=18, pady=(14, 2), fill="x")

        # Linha do Resultado / Entrada atual
        self.label_resultado = ctk.CTkLabel(
            display_frame,
            text="0",
            font=("Plus Jakarta Sans", 38, "bold"),
            text_color=self.COLOR_TEXT,
            anchor="e"
        )
        self.label_resultado.pack(padx=18, pady=(0, 14), fill="x")

        # Grid dos Botões
        grid_frame = ctk.CTkFrame(self, fg_color="transparent")
        grid_frame.pack(padx=16, pady=4, fill="both", expand=True)

        for i in range(5):
            grid_frame.rowconfigure(i, weight=1)
        for j in range(4):
            grid_frame.columnconfigure(j, weight=1)

        botoes = [
            ("C", 0, 0, self.limpar, self.COLOR_BTN_SPEC, self.COLOR_BTN_SPEC_HOVER),
            ("⌫", 0, 1, self.apagar, self.COLOR_BTN_SPEC, self.COLOR_BTN_SPEC_HOVER),
            ("%", 0, 2, lambda: self.adicionar_operador("%"), self.COLOR_BTN_SPEC, self.COLOR_BTN_SPEC_HOVER),
            ("÷", 0, 3, lambda: self.adicionar_operador("/"), self.COLOR_BTN_OP, self.COLOR_BTN_OP_HOVER),

            ("7", 1, 0, lambda: self.adicionar_numero("7"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("8", 1, 1, lambda: self.adicionar_numero("8"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("9", 1, 2, lambda: self.adicionar_numero("9"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("×", 1, 3, lambda: self.adicionar_operador("*"), self.COLOR_BTN_OP, self.COLOR_BTN_OP_HOVER),

            ("4", 2, 0, lambda: self.adicionar_numero("4"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("5", 2, 1, lambda: self.adicionar_numero("5"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("6", 2, 2, lambda: self.adicionar_numero("6"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("-", 2, 3, lambda: self.adicionar_operador("-"), self.COLOR_BTN_OP, self.COLOR_BTN_OP_HOVER),

            ("1", 3, 0, lambda: self.adicionar_numero("1"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("2", 3, 1, lambda: self.adicionar_numero("2"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("3", 3, 2, lambda: self.adicionar_numero("3"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("+", 3, 3, lambda: self.adicionar_operador("+"), self.COLOR_BTN_OP, self.COLOR_BTN_OP_HOVER),

            ("±", 4, 0, self.inverter_sinal, self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("0", 4, 1, lambda: self.adicionar_numero("0"), self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            (".", 4, 2, self.adicionar_ponto, self.COLOR_BTN_NUM, self.COLOR_BTN_NUM_HOVER),
            ("=", 4, 3, self.calcular, self.COLOR_BTN_OP, self.COLOR_BTN_OP_HOVER),
        ]

        for texto, linha, coluna, comando, cor_bg, cor_hover in botoes:
            btn = ctk.CTkButton(
                grid_frame,
                text=texto,
                font=("Plus Jakarta Sans", 20, "bold"),
                fg_color=cor_bg,
                hover_color=cor_hover,
                text_color=self.COLOR_TEXT,
                corner_radius=12,
                command=comando,
                height=56,
                width=68
            )
            btn.grid(row=linha, column=coluna, padx=5, pady=5, sticky="nsew")

    def adicionar_numero(self, num):
        if self.expressao == "0" and num != ".":
            self.expressao = num
        else:
            self.expressao += num
        self.atualizar_display()

    def adicionar_operador(self, op):
        if not self.expressao:
            if op == "-":
                self.expressao = "-"
                self.atualizar_display()
            return
        if self.expressao[-1] in "+-*/%":
            self.expressao = self.expressao[:-1] + op
        else:
            self.expressao += op
        self.atualizar_display()

    def adicionar_ponto(self):
        partes = self.expressao.replace("+", " ").replace("-", " ").replace("*", " ").replace("/", " ").split()
        if partes and "." in partes[-1]:
            return
        if not self.expressao or self.expressao[-1] in "+-*/%":
            self.expressao += "0."
        else:
            self.expressao += "."
        self.atualizar_display()

    def inverter_sinal(self):
        try:
            if self.expressao:
                valor = eval(self.expressao)
                self.expressao = str(-valor)
                self.atualizar_display()
        except:
            pass

    def limpar(self):
        self.expressao = ""
        self.label_expressao.configure(text="")
        self.label_resultado.configure(text="0")

    def apagar(self):
        self.expressao = self.expressao[:-1]
        self.atualizar_display()

    def calcular(self):
        if not self.expressao:
            return
        try:
            # Avaliação segura da expressão matemática em Python
            expressao_formatada = self.expressao.replace("÷", "/").replace("×", "*")
            safe_env = {k: v for k, v in math.__dict__.items() if not k.startswith("__")}
            safe_env.update({"abs": abs, "round": round, "pow": pow, "min": min, "max": max, "math": math})
            resultado = eval(expressao_formatada, {"__builtins__": {}}, safe_env)
            
            # Formatação do resultado (remove zeros desnecessários)
            if isinstance(resultado, float) and resultado.is_integer():
                resultado = int(resultado)
            elif isinstance(resultado, float):
                resultado = round(resultado, 8)

            self.label_expressao.configure(text=f"{self.expressao} =")
            self.expressao = str(resultado)
            self.label_resultado.configure(text=str(resultado))
        except ZeroDivisionError:
            self.label_resultado.configure(text="Erro: Div / 0")
            self.expressao = ""
        except Exception:
            self.label_resultado.configure(text="Erro de Sintaxe")
            self.expressao = ""

    def atualizar_display(self):
        display_text = self.expressao if self.expressao else "0"
        # Substitui símbolos técnicos para exibição amigável
        display_text = display_text.replace("/", "÷").replace("*", "×")
        self.label_resultado.configure(text=display_text)

    def configurar_teclado(self):
        self.bind("<Return>", lambda e: self.calcular())
        self.bind("<KP_Enter>", lambda e: self.calcular())
        self.bind("<Escape>", lambda e: self.limpar())
        self.bind("<BackSpace>", lambda e: self.apagar())
        for digito in "0123456789":
            self.bind(digito, lambda e, d=digito: self.adicionar_numero(d))
            self.bind(f"<KP_{digito}>", lambda e, d=digito: self.adicionar_numero(d))
        self.bind("+", lambda e: self.adicionar_operador("+"))
        self.bind("-", lambda e: self.adicionar_operador("-"))
        self.bind("*", lambda e: self.adicionar_operador("*"))
        self.bind("/", lambda e: self.adicionar_operador("/"))
        self.bind(".", lambda e: self.adicionar_ponto())
        self.bind(",", lambda e: self.adicionar_ponto())

if __name__ == "__main__":
    app = CalculadoraModerna()
    app.mainloop()
`;

export const TKINTER_STANDARD_CODE = `"""
Calculadora Moderna em Python (Tkinter Padrão - Sem dependências externas!)
Cores: Laranja (#FF6B00), Preto (#0D0D0D) e Branco (#FFFFFF)
Execução direta: python calculadora.py
"""

import tkinter as tk
from tkinter import font
import math

class CalculadoraTkinter:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculadora Python")
        self.root.geometry("350x500")
        self.root.resizable(False, False)

        # Paleta de Cores: Laranja, Preto e Branco
        self.BG_PRETO = "#0D0D0D"
        self.DISPLAY_BG = "#1A1A1A"
        self.BTN_LARANJA = "#FF6B00"
        self.BTN_LARANJA_ATIVO = "#E05E00"
        self.BTN_NUMERO = "#262626"
        self.BTN_NUMERO_ATIVO = "#333333"
        self.BTN_FUNCAO = "#3A3A3A"
        self.BTN_FUNCAO_ATIVO = "#4A4A4A"
        self.TEXTO_BRANCO = "#FFFFFF"
        self.TEXTO_CINZA = "#A1A1AA"

        self.root.configure(bg=self.BG_PRETO)
        self.expressao = ""

        self.criar_interface()
        self.configurar_atalhos()

    def criar_interface(self):
        # Visor / Display
        frame_display = tk.Frame(self.root, bg=self.DISPLAY_BG, bd=0, highlightthickness=1, highlightbackground="#333333")
        frame_display.pack(padx=16, pady=(16, 12), fill="x")

        self.lbl_expressao = tk.Label(
            frame_display, 
            text="", 
            font=("Helvetica", 11), 
            fg=self.TEXTO_CINZA, 
            bg=self.DISPLAY_BG, 
            anchor="e"
        )
        self.lbl_expressao.pack(padx=12, pady=(10, 0), fill="x")

        self.lbl_resultado = tk.Label(
            frame_display, 
            text="0", 
            font=("Helvetica", 32, "bold"), 
            fg=self.TEXTO_BRANCO, 
            bg=self.DISPLAY_BG, 
            anchor="e"
        )
        self.lbl_resultado.pack(padx=12, pady=(0, 10), fill="x")

        # Container dos Botões
        frame_botoes = tk.Frame(self.root, bg=self.BG_PRETO)
        frame_botoes.pack(padx=16, pady=4, fill="both", expand=True)

        botoes = [
            ("C", 0, 0, self.limpar, self.BTN_FUNCAO, self.BTN_FUNCAO_ATIVO),
            ("⌫", 0, 1, self.apagar, self.BTN_FUNCAO, self.BTN_FUNCAO_ATIVO),
            ("%", 0, 2, lambda: self.inserir_op("%"), self.BTN_FUNCAO, self.BTN_FUNCAO_ATIVO),
            ("÷", 0, 3, lambda: self.inserir_op("/"), self.BTN_LARANJA, self.BTN_LARANJA_ATIVO),

            ("7", 1, 0, lambda: self.inserir_num("7"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("8", 1, 1, lambda: self.inserir_num("8"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("9", 1, 2, lambda: self.inserir_num("9"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("×", 1, 3, lambda: self.inserir_op("*"), self.BTN_LARANJA, self.BTN_LARANJA_ATIVO),

            ("4", 2, 0, lambda: self.inserir_num("4"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("5", 2, 1, lambda: self.inserir_num("5"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("6", 2, 2, lambda: self.inserir_num("6"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("-", 2, 3, lambda: self.inserir_op("-"), self.BTN_LARANJA, self.BTN_LARANJA_ATIVO),

            ("1", 3, 0, lambda: self.inserir_num("1"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("2", 3, 1, lambda: self.inserir_num("2"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("3", 3, 2, lambda: self.inserir_num("3"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("+", 3, 3, lambda: self.inserir_op("+"), self.BTN_LARANJA, self.BTN_LARANJA_ATIVO),

            ("±", 4, 0, self.inverter, self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("0", 4, 1, lambda: self.inserir_num("0"), self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            (".", 4, 2, self.inserir_ponto, self.BTN_NUMERO, self.BTN_NUMERO_ATIVO),
            ("=", 4, 3, self.calcular, self.BTN_LARANJA, self.BTN_LARANJA_ATIVO),
        ]

        for i in range(5):
            frame_botoes.rowconfigure(i, weight=1)
        for j in range(4):
            frame_botoes.columnconfigure(j, weight=1)

        for txt, lin, col, cmd, bg_col, act_col in botoes:
            btn = tk.Button(
                frame_botoes,
                text=txt,
                command=cmd,
                font=("Helvetica", 16, "bold"),
                bg=bg_col,
                fg=self.TEXTO_BRANCO,
                activebackground=act_col,
                activeforeground=self.TEXTO_BRANCO,
                relief="flat",
                bd=0,
                cursor="hand2"
            )
            btn.grid(row=lin, column=col, padx=4, pady=4, sticky="nsew")

    def inserir_num(self, n):
        if self.expressao == "0":
            self.expressao = n
        else:
            self.expressao += n
        self.atualizar()

    def inserir_op(self, op):
        if self.expressao and self.expressao[-1] in "+-*/%":
            self.expressao = self.expressao[:-1] + op
        else:
            self.expressao += op
        self.atualizar()

    def inserir_ponto(self):
        if not self.expressao or self.expressao[-1] in "+-*/%":
            self.expressao += "0."
        elif "." not in self.expressao.split("+")[-1].split("-")[-1].split("*")[-1].split("/")[-1]:
            self.expressao += "."
        self.atualizar()

    def inverter(self):
        try:
            if self.expressao:
                v = eval(self.expressao)
                self.expressao = str(-v)
                self.atualizar()
        except:
            pass

    def limpar(self):
        self.expressao = ""
        self.lbl_expressao.config(text="")
        self.lbl_resultado.config(text="0")

    def apagar(self):
        self.expressao = self.expressao[:-1]
        self.atualizar()

    def calcular(self):
        if not self.expressao:
            return
        try:
            safe_env = {k: v for k, v in math.__dict__.items() if not k.startswith("__")}
            safe_env.update({"abs": abs, "round": round, "pow": pow, "min": min, "max": max, "math": math})
            res = eval(self.expressao, {"__builtins__": {}}, safe_env)
            if isinstance(res, float) and res.is_integer():
                res = int(res)
            elif isinstance(res, float):
                res = round(res, 8)
            self.lbl_expressao.config(text=f"{self.expressao} =")
            self.expressao = str(res)
            self.lbl_resultado.config(text=str(res))
        except ZeroDivisionError:
            self.lbl_resultado.config(text="Erro: Div / 0")
            self.expressao = ""
        except:
            self.lbl_resultado.config(text="Erro")
            self.expressao = ""

    def atualizar(self):
        t = self.expressao if self.expressao else "0"
        t = t.replace("/", "÷").replace("*", "×")
        self.lbl_resultado.config(text=t)

    def configurar_atalhos(self):
        self.root.bind("<Return>", lambda e: self.calcular())
        self.root.bind("<BackSpace>", lambda e: self.apagar())
        self.root.bind("<Escape>", lambda e: self.limpar())
        for d in "0123456789":
            self.root.bind(d, lambda e, digit=d: self.inserir_num(digit))
        for op in "+-*/":
            self.root.bind(op, lambda e, oper=op: self.inserir_op(oper))

if __name__ == "__main__":
    janela = tk.Tk()
    app = CalculadoraTkinter(janela)
    janela.mainloop()
`;
