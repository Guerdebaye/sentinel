import React from 'react';

export default function About() {
  const team = [
    {
      name: 'Dr. Amadou Diallo',
      role: 'Fondateur & Directeur IA',
      bio: 'Ancien chercheur en IA chez Google Brain, spécialiste en apprentissage fédéré',
      country: '🇸🇳 Sénégal',
      image: '👨‍🔬'
    },
    {
      name: 'Mariam Koné',
      role: 'Directrice Cybersécurité',
      bio: 'Experte en sécurité informatique, ancienne consultante pour l\'Union Africaine',
      country: '🇨🇮 Côte d\'Ivoire',
      image: '👩‍💻'
    },
    {
      name: 'Ibrahim Traoré',
      role: 'Lead Developer',
      bio: 'Développeur full-stack, contributeur open source pour des projets de privacy',
      country: '🇧🇫 Burkina Faso',
      image: '👨‍💻'
    },
    {
      name: 'Fatoumata Sy',
      role: 'Responsable Partenariats',
      bio: 'Experte en relations internationales et développement en Afrique',
      country: '🇸🇳 Sénégal',
      image: '👩‍💼'
    },
  ];

  const partners = [
    { name: 'Union Africaine', logo: '🌍', type: 'Institutionnel' },
    { name: 'Smart Africa', logo: '📡', type: 'Partenariat technique' },
    { name: 'Orange Digital Center', logo: '📱', type: 'Innovation' },
    { name: 'Google AI', logo: '🤖', type: 'Recherche' },
    { name: 'Mozilla Foundation', logo: '🦊', type: 'Privacy' },
    { name: 'UNESCO', logo: '📚', type: 'Éducation' },
  ];

  const timeline = [
    { year: '2023 Q1', event: 'Lancement du projet Sentinel', status: '✅ Complété' },
    { year: '2023 Q2', event: 'Premier prototype fonctionnel', status: '✅ Complété' },
    { year: '2023 Q3', event: 'Test pilote au Sénégal (1000 utilisateurs)', status: '✅ Complété' },
    { year: '2023 Q4', event: 'Déploiement en Afrique de l\'Ouest', status: '✅ Complété' },
    { year: '2024 Q1', event: 'Lancement officiel', status: '🚀 En cours' },
    { year: '2024 Q2', event: 'Expansion panafricaine', status: '📅 Planifié' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>Sentinel</h1>
          <p className="hero-tagline">L'Immunité Numérique Collective pour l'Afrique</p>
          <p className="hero-description">
            Nous construisons le premier système immunitaire numérique décentralisé, 
            où chaque utilisateur devient un nœud de défense contre la désinformation 
            et les cybermenaces, sans jamais compromettre sa vie privée.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission-section">
        <h2>Notre Mission</h2>
        <div className="mission-cards">
          <div className="mission-card">
            <span className="mission-icon">🛡️</span>
            <h3>Protéger</h3>
            <p>Les citoyens africains contre les deepfakes, la désinformation et les cybermenaces</p>
          </div>
          <div className="mission-card">
            <span className="mission-icon">🔒</span>
            <h3>Préserver</h3>
            <p>La vie privée grâce à l'apprentissage fédéré et au traitement local des données</p>
          </div>
          <div className="mission-card">
            <span className="mission-icon">🌍</span>
            <h3>Unir</h3>
            <p>Les communautés dans un effort collectif de sécurité numérique</p>
          </div>
          <div className="mission-card">
            <span className="mission-icon">🎓</span>
            <h3>Éduquer</h3>
            <p>Sur les risques numériques et les bonnes pratiques de sécurité</p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="story-section">
        <h2>Notre Histoire</h2>
        <div className="story-content">
          <div className="story-text">
            <p>
              Sentinel est né d'un constat alarmant : l'Afrique est devenue la cible privilégiée 
              de campagnes de désinformation et de deepfakes, sans disposer d'outils de protection 
              adaptés à son contexte.
            </p>
            <p>
              En 2023, une équipe de chercheurs et d'ingénieurs africains s'est réunie avec une 
              vision : créer un système de protection numérique qui respecte la souveraineté des 
              données et la vie privée des utilisateurs, tout en étant suffisamment puissant pour 
              faire face aux menaces modernes.
            </p>
            <p>
              La solution ? L'apprentissage fédéré (federated learning), une technologie 
              révolutionnaire qui permet d'entraîner des modèles d'IA sans jamais centraliser 
              les données personnelles.
            </p>
          </div>
          <div className="story-stats">
            <div className="story-stat">
              <span className="stat-value">10</span>
              <span className="stat-label">Pays couverts</span>
            </div>
            <div className="story-stat">
              <span className="stat-value">50K+</span>
              <span className="stat-label">Utilisateurs</span>
            </div>
            <div className="story-stat">
              <span className="stat-value">15K+</span>
              <span className="stat-label">Menaces détectées</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline-section">
        <h2>Notre Parcours</h2>
        <div className="timeline">
          {timeline.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-content">
                <h4>{item.event}</h4>
                <span className="timeline-status">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <h2>L'Équipe</h2>
        <p className="section-subtitle">Des experts passionnés venus de toute l'Afrique</p>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-avatar">{member.image}</div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
              <div className="team-country">{member.country}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div className="partners-section">
        <h2>Ils nous soutiennent</h2>
        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="partner-card">
              <span className="partner-logo">{partner.logo}</span>
              <h4>{partner.name}</h4>
              <span className="partner-type">{partner.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <h2>Nos Valeurs</h2>
        <div className="values-grid">
          <div className="value-item">
            <span className="value-icon">🔓</span>
            <h3>Open Source</h3>
            <p>Notre code est transparent et vérifiable par tous</p>
          </div>
          <div className="value-item">
            <span className="value-icon">🤝</span>
            <h3>Communautaire</h3>
            <p>Construit par et pour les communautés africaines</p>
          </div>
          <div className="value-item">
            <span className="value-icon">⚖️</span>
            <h3>Équitable</h3>
            <p>Gratuit pour tous, sans collecte de données</p>
          </div>
          <div className="value-item">
            <span className="value-icon">🌱</span>
            <h3>Souverain</h3>
            <p>Les données restent en Afrique, sous contrôle africain</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2>Nous Contacter</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>contact@sentinel.africa</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+221 33 123 45 67</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>Dakar, Sénégal · Abidjan, Côte d'Ivoire</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🐦</span>
              <span>@SentinelAfrica</span>
            </div>
          </div>
          <div className="contact-form">
            <input type="text" placeholder="Votre nom" className="form-input" />
            <input type="email" placeholder="Votre email" className="form-input" />
            <textarea placeholder="Votre message" className="form-input" rows="4"></textarea>
            <button className="send-btn">Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  );
}