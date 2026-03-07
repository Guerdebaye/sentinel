import React from 'react';

export default function About() {
  const team = [
    {
      name: 'M. ABIBOU Nokho',
      role: 'Developpeur frontned',
      bio: 'Etudiant en Reseau et Systeme à l\'Institut Superieur d\'Informatique de Dakar, passionné par les technologies de l\'IA et la protection de la vie privée',
      country: '🇸🇳 Sénégal',
      image: '👨‍🔬'
    },
    {
      name: 'GUERDEBAYE MOULEDJIM Hyacinthe',
      role: 'Developpeur backend',
      bio: 'Etudiant en Reseau et systeme à l\'Institut Superieur d\'Informatique, spécialisé en sécurité informatique et en apprentissage automatique',
      country: '🇸🇳 Sénégal',
      image: '👩‍💻'
    },
    {
      name: 'AMADOU DIAGNE DIAW',
      role: 'Developpeur',
      bio: 'Etudiant en Reseau et Systeme à l\'Institut Superieur d\'Informatique, passionné par la cybersécurité et les systèmes distribués',
      country: '🇸🇳 Sénégal',
      image: '👨‍💻'
    }
   
  ];

 

  /**/const timeline = [
   
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
        <p className="section-subtitle">Des étudiants passionnés</p>
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
            <p>Construit par des étudiants africain et pour les communautés africaines</p>
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
              <span>Dakar, Sénégal</span>
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