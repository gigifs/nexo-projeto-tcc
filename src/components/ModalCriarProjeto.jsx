import React, { useState } from "react";
import "./ModalCriarProjeto.css";

export default function ModalCriarProjeto({ onClose }) {
  const [skills, setSkills] = useState(["JavaScript", "Hackaton"]);
  const [newSkill, setNewSkill] = useState("");

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Criar novo projeto</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="modal-form">
          <label>Nome do Projeto</label>
          <input type="text" placeholder="Ex. Plataforma de Match Acadêmico" />

          <label>Descrição</label>
          <textarea placeholder="Descreva seu projeto..."></textarea>

          <label>Área relacionada</label>
          <select>
            <option>Selecione uma área</option>
            <option>Front-End</option>
            <option>Back-End</option>
            <option>Pesquisa</option>
          </select>

          <label>Habilidades Necessárias</label>
          <div className="skills-input">
            <input
              type="text"
              placeholder="Ex. FrontEnd, Pesquisa"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button
              type="button"
              className="add-skill-btn"
              onClick={addSkill}
            >
              +
            </button>
          </div>

          <div className="skills-tags">
            {skills.map((skill, index) => (
              <span
                key={index}
                className={`tag ${index % 2 === 0 ? "blue" : "pink"}`}
              >
                {skill}
                <button
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeSkill(index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="create-btn">
              Criar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
