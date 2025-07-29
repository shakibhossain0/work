// Mission Builder Module

// DOM Elements
const destinationSelector = document.getElementById('destination');
const rocketSelector = document.getElementById('rocket');
const fuelSelector = document.getElementById('fuel');
const simulateMissionBtn = document.getElementById('simulate-mission');
const missionOutput = document.getElementById('mission-output');

// Mission data
const missionData = {
    destinations: {
        mars: {
            name: "Mars",
            distance: 225000000, // km
            travelTime: 210, // days
            difficulty: "Medium",
            description: "The Red Planet, our nearest neighbor with potential for colonization."
        },
        europa: {
            name: "Europa",
            distance: 628000000, // km
            travelTime: 1825, // days (5 years)
            difficulty: "Hard",
            description: "Jupiter's icy moon with a subsurface ocean that may harbor life."
        },
        titan: {
            name: "Titan",
            distance: 1400000000, // km
            travelTime: 2555, // days (7 years)
            difficulty: "Hard",
            description: "Saturn's largest moon with a thick atmosphere and methane lakes."
        },
        proxima: {
            name: "Proxima Centauri",
            distance: 40208000000000, // km
            travelTime: 73000, // days (200 years)
            difficulty: "Extreme",
            description: "Nearest star to our Sun with a potentially habitable exoplanet."
        }
    },
    
    rockets: {
        falcon: {
            name: "Falcon Heavy",
            thrust: 22800, // kN
            isp: 315, // seconds
            capacity: 63800, // kg to LEO
            description: "Currently operational heavy-lift launch vehicle."
        },
        starship: {
            name: "Starship",
            thrust: 150000, // kN
            isp: 380, // seconds
            capacity: 150000, // kg to LEO
            description: "Next-generation fully reusable super heavy-lift launch vehicle."
        },
        ion: {
            name: "Ion Drive",
            thrust: 0.5, // N
            isp: 3000, // seconds
            capacity: 1000, // kg
            description: "Electric propulsion system with extremely high efficiency."
        },
        nuclear: {
            name: "Nuclear Thermal",
            thrust: 50000, // N
            isp: 900, // seconds
            capacity: 20000, // kg
            description: "Nuclear-powered propulsion for deep space missions."
        }
    },
    
    fuels: {
        rp1: {
            name: "RP-1/LOX",
            energy: 35000, // kJ/kg
            density: 1000, // kg/m³
            cost: 2.5, // $/kg
            description: "Refined kerosene and liquid oxygen, commonly used in rockets."
        },
        methane: {
            name: "Methane/LOX",
            energy: 55000, // kJ/kg
            density: 420, // kg/m³
            cost: 3.2, // $/kg
            description: "Methane and liquid oxygen, suitable for Mars missions."
        },
        hydrogen: {
            name: "Liquid Hydrogen",
            energy: 142000, // kJ/kg
            density: 71, // kg/m³
            cost: 8.5, // $/kg
            description: "Highest specific impulse fuel for deep space missions."
        },
        xenon: {
            name: "Xenon",
            energy: 50000, // kJ/kg
            density: 5900, // kg/m³
            cost: 25.0, // $/kg
            description: "Inert gas used in ion propulsion systems."
        }
    }
};

// Initialize mission builder
function initMissionBuilder() {
    if (!missionOutput) return;
    
    // Set up event listeners
    setupMissionEventListeners();
    
    // Display initial mission info
    updateMissionInfo();
}

// Set up event listeners for mission builder
function setupMissionEventListeners() {
    // Update mission info when selections change
    destinationSelector.addEventListener('change', updateMissionInfo);
    rocketSelector.addEventListener('change', updateMissionInfo);
    fuelSelector.addEventListener('change', updateMissionInfo);
    
    // Simulate mission button
    simulateMissionBtn.addEventListener('click', simulateMission);
}

// Update mission information display
function updateMissionInfo() {
    const destination = missionData.destinations[destinationSelector.value];
    const rocket = missionData.rockets[rocketSelector.value];
    const fuel = missionData.fuels[fuelSelector.value];
    
    if (!destination || !rocket || !fuel) return;
    
    // Display basic mission parameters
    missionOutput.innerHTML = `
        <div class="mission-summary">
            <h4>Mission Parameters</h4>
            <div class="mission-param">
                <span class="param-label">Destination:</span>
                <span class="param-value">${destination.name}</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Distance:</span>
                <span class="param-value">${formatDistance(destination.distance)} km</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Rocket:</span>
                <span class="param-value">${rocket.name}</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Fuel:</span>
                <span class="param-value">${fuel.name}</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Estimated Travel Time:</span>
                <span class="param-value">${formatTime(destination.travelTime)}</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Difficulty:</span>
                <span class="param-value difficulty-${destination.difficulty.toLowerCase()}">${destination.difficulty}</span>
            </div>
        </div>
        <div class="mission-description">
            <p>${destination.description}</p>
        </div>
    `;
}

// Simulate mission
function simulateMission() {
    const destination = missionData.destinations[destinationSelector.value];
    const rocket = missionData.rockets[rocketSelector.value];
    const fuel = missionData.fuels[fuelSelector.value];
    
    if (!destination || !rocket || !fuel) return;
    
    // Calculate mission success probability
    const successProbability = calculateMissionSuccess(destination, rocket, fuel);
    
    // Generate mission simulation
    const missionResult = generateMissionSimulation(destination, rocket, fuel, successProbability);
    
    // Display mission results
    displayMissionResults(missionResult);
}

// Calculate mission success probability
function calculateMissionSuccess(destination, rocket, fuel) {
    // Base probability factors
    let probability = 100;
    
    // Difficulty factor
    switch (destination.difficulty) {
        case "Easy":
            probability *= 0.95;
            break;
        case "Medium":
            probability *= 0.85;
            break;
        case "Hard":
            probability *= 0.70;
            break;
        case "Extreme":
            probability *= 0.40;
            break;
    }
    
    // Rocket capability factor
    if (destination.distance > 500000000 && rocket.thrust < 50000) {
        probability *= 0.6; // Not suitable for deep space
    }
    
    // Fuel efficiency factor
    if (destination.distance > 1000000000 && fuel.energy < 100000) {
        probability *= 0.7; // Not efficient enough for very long distances
    }
    
    // Random factor for realism
    probability *= (0.9 + Math.random() * 0.2);
    
    return Math.min(100, Math.max(0, probability));
}

// Generate mission simulation
function generateMissionSimulation(destination, rocket, fuel, successProbability) {
    const isSuccess = Math.random() * 100 < successProbability;
    
    // Mission phases
    const phases = [
        "Launch Sequence",
        "Orbital Insertion",
        "Trajectory Correction",
        "Cruise Phase",
        "Approach Maneuver",
        "Destination Arrival"
    ];
    
    // Generate phase results
    const phaseResults = phases.map(phase => {
        const phaseSuccess = Math.random() * 100 < successProbability + 10;
        return {
            name: phase,
            success: phaseSuccess,
            status: phaseSuccess ? "Completed" : "Issue Detected"
        };
    });
    
    // Mission outcome
    const outcome = isSuccess ? "SUCCESS" : "MISSION ABORT";
    
    // Generate mission log
    const missionLog = generateMissionLog(destination, rocket, isSuccess);
    
    return {
        destination: destination.name,
        rocket: rocket.name,
        fuel: fuel.name,
        successProbability: successProbability.toFixed(1),
        outcome: outcome,
        phaseResults: phaseResults,
        missionLog: missionLog,
        travelTime: formatTime(destination.travelTime),
        distance: formatDistance(destination.distance)
    };
}

// Generate mission log
function generateMissionLog(destination, rocket, isSuccess) {
    const logs = [
        `Mission to ${destination.name} initiated using ${rocket.name}`,
        "Launch vehicle performing nominally",
        "Achieved stable orbit around Earth",
        "Trans-${destination.name} injection burn complete",
        "Cruise phase initiated, all systems nominal"
    ];
    
    if (isSuccess) {
        logs.push(
            `Approaching ${destination.name} orbit`,
            `Orbital insertion successful`,
            `Mission objectives achieved`
        );
    } else {
        logs.push(
            "Anomaly detected in propulsion system",
            "Mission abort sequence initiated",
            "Returning to Earth orbit"
        );
    }
    
    return logs;
}

// Display mission results
function displayMissionResults(result) {
    let html = `
        <div class="mission-results-header">
            <h4>Mission Simulation Results</h4>
            <div class="mission-outcome ${result.outcome.toLowerCase()}">
                ${result.outcome}
            </div>
        </div>
        <div class="mission-details">
            <div class="mission-param">
                <span class="param-label">Destination:</span>
                <span class="param-value">${result.destination}</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Rocket:</span>
                <span class="param-value">${result.rocket}</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Fuel:</span>
                <span class="param-value">${result.fuel}</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Distance:</span>
                <span class="param-value">${result.distance} km</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Travel Time:</span>
                <span class="param-value">${result.travelTime}</span>
            </div>
            <div class="mission-param">
                <span class="param-label">Success Probability:</span>
                <span class="param-value">${result.successProbability}%</span>
            </div>
        </div>
        <div class="mission-phases">
            <h5>Mission Phases</h5>
            <div class="phase-list">
    `;
    
    result.phaseResults.forEach(phase => {
        html += `
            <div class="phase-item">
                <span class="phase-name">${phase.name}</span>
                <span class="phase-status ${phase.success ? 'success' : 'failure'}">
                    ${phase.status}
                </span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        <div class="mission-log">
            <h5>Mission Log</h5>
            <div class="log-entries">
    `;
    
    result.missionLog.forEach(entry => {
        html += `<div class="log-entry">${entry}</div>`;
    });
    
    html += `
            </div>
        </div>
    `;
    
    missionOutput.innerHTML = html;
}

// Format distance for display
function formatDistance(distance) {
    if (distance >= 1000000000) {
        return (distance / 1000000000).toFixed(2) + "B";
    } else if (distance >= 1000000) {
        return (distance / 1000000).toFixed(2) + "M";
    } else if (distance >= 1000) {
        return (distance / 1000).toFixed(2) + "K";
    }
    return distance.toString();
}

// Format time for display
function formatTime(days) {
    if (days >= 365) {
        const years = (days / 365).toFixed(1);
        return `${years} years (${days} days)`;
    } else if (days >= 30) {
        const months = (days / 30).toFixed(1);
        return `${months} months (${days} days)`;
    }
    return `${days} days`;
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the missions section to be visible
    const missionsSection = document.getElementById('missions');
    if (missionsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initMissionBuilder();
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(missionsSection);
    }
});

// Export for use in other modules
window.MissionBuilder = {
    init: initMissionBuilder
};
