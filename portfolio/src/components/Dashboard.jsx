import React from 'react';
import Home from './Home';
import StatusStrip from './StatusStrip';
import Experience from './Experience';
import Projects from './Projects';
import Skills from './Skills';
import SREToolkit from './SREToolkit';
import LearningJourney from './LearningJourney';
import Contact from './Contact';

export default function Dashboard({ data, contactProps, onOpenTerminal }) {
  return (
    <main className="dash">
      <Home personal={data.personal} onOpenTerminal={onOpenTerminal} />
      <div className="bento">
        <div className="bento-cell span-12"><StatusStrip /></div>
        <div className="bento-cell panel span-5"><Experience experience={data.experience} /></div>
        <div className="bento-cell panel span-7"><Projects projects={data.projects} /></div>
        <div className="bento-cell panel span-7">
          <Skills skills={data.skills} />
          <SREToolkit sreToolkit={data.sreToolkit} />
        </div>
        <div className="bento-cell panel span-5"><LearningJourney learning={data.learning} /></div>
        <div className="bento-cell panel span-12"><Contact {...contactProps} /></div>
      </div>
    </main>
  );
}
