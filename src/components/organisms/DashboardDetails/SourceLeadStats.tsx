import React from 'react';
import { useSourceLeadStats } from '../../../hooks/useDashboard';

// Couleurs pour chaque source
const COLORS = [
    '#3B82F6', // Bleu
    '#10B981', // Vert
    '#F59E0B', // Orange
    '#EF4444', // Rouge
    '#8B5CF6', // Violet
    '#F97316', // Orange foncé
    '#06B6D4', // Cyan
    '#84CC16', // Lime
];

const SourceLeadStats: React.FC = () => {
    const { data: sourceStats, isLoading, error } = useSourceLeadStats();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40 bg-white rounded-lg shadow-md">
                <div className="flex border-2 border-t-blue-600 h-8 w-8 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 font-oswald">
                <div className="text-red-500 text-center">
                    Erreur: {(error as Error).message}
                </div>
            </div>
        );
    }

    if (!sourceStats) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 font-oswald">
                <div className="text-gray-500 text-center">
                    Aucune donnée disponible
                </div>
            </div>
        );
    }

    // Calculer les angles pour le graphique circulaire
    const calculatePieSlices = () => {
        let cumulativePercentage = 0;
        return sourceStats.sourceStats.map((stat, index) => {
            const percentage = parseFloat(stat.percentage);
            const startAngle = cumulativePercentage * 3.6; // Convertir en degrés
            const endAngle = (cumulativePercentage + percentage) * 3.6;
            cumulativePercentage += percentage;
            
            return {
                ...stat,
                startAngle,
                endAngle,
                color: COLORS[index % COLORS.length]
            };
        });
    };

    const pieSlices = calculatePieSlices();

    // Créer le chemin SVG pour chaque segment
    const createPath = (startAngle: number, endAngle: number, outerRadius = 120) => {
        const startAngleRad = (startAngle - 90) * (Math.PI / 180);
        const endAngleRad = (endAngle - 90) * (Math.PI / 180);
        
        const x1 = 150 + outerRadius * Math.cos(startAngleRad);
        const y1 = 150 + outerRadius * Math.sin(startAngleRad);
        const x2 = 150 + outerRadius * Math.cos(endAngleRad);
        const y2 = 150 + outerRadius * Math.sin(endAngleRad);
        
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        
        return `M 150 150 L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 font-oswald relative z-0">
            <div className="mb-6">
                <h2 className="text-xl text-gray-800 mb-2">
                    Statistiques des Sources de Prospects
                </h2>
                <p className="text-sm text-gray-600">
                    Total des devis: <span className="font-semibold">{sourceStats.totalDevis}</span>
                </p>
            </div>

            <div className="flex flex-col xl:flex-row items-center space-y-8 xl:space-y-0 xl:space-x-12">
                {/* Graphique circulaire */}
                <div className="flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full transform scale-110 opacity-30"></div>
                    <svg width="300" height="300" viewBox="0 0 300 300" className="relative drop-shadow-lg">
                        {pieSlices.map((slice, index) => (
                            <g key={index}>
                                <path
                                    d={createPath(slice.startAngle, slice.endAngle)}
                                    fill={slice.color}
                                    stroke="white"
                                    strokeWidth="3"
                                    className="hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer filter drop-shadow-md"
                                    style={{
                                        transformOrigin: '150px 150px'
                                    }}
                                />
                                {/* Ajouter une ombre intérieure pour plus de profondeur */}
                                <path
                                    d={createPath(slice.startAngle, slice.endAngle)}
                                    fill="url(#innerShadow)"
                                    opacity="0.1"
                                />
                            </g>
                        ))}
                        
                        {/* Définir un gradient pour l'ombre intérieure */}
                        <defs>
                            <radialGradient id="innerShadow" cx="50%" cy="30%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
                                <stop offset="100%" stopColor="black" stopOpacity="0.2"/>
                            </radialGradient>
                            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="black" floodOpacity="0.15"/>
                            </filter>
                        </defs>
                        
                        {/* Cercle central pour créer un effet de donut avec gradient */}
                        <circle
                            cx="150"
                            cy="150"
                            r="45"
                            fill="white"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            className="drop-shadow-md"
                        />
                        
                        {/* Cercle intérieur pour plus de profondeur */}
                        <circle
                            cx="150"
                            cy="150"
                            r="40"
                            fill="url(#centerGradient)"
                        />
                        
                        <defs>
                            <radialGradient id="centerGradient" cx="50%" cy="30%">
                                <stop offset="0%" stopColor="#f8fafc"/>
                                <stop offset="100%" stopColor="#e2e8f0"/>
                            </radialGradient>
                        </defs>
                        
                        {/* Texte au centre avec style amélioré */}
                        <text
                            x="150"
                            y="140"
                            textAnchor="middle"
                            className="text-base font-bold fill-gray-700"
                        >
                            Sources
                        </text>
                        <text
                            x="150"
                            y="158"
                            textAnchor="middle"
                            className="text-sm font-medium fill-gray-600"
                        >
                            de Prospects
                        </text>
                        <text
                            x="150"
                            y="175"
                            textAnchor="middle"
                            className="text-xs fill-gray-500"
                        >
                            {sourceStats.totalDevis} total
                        </text>
                    </svg>
                </div>

                {/* Légende */}
                <div className="flex-1 space-y-3 min-w-0">
                    {pieSlices.map((slice, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200">
                            <div className="flex items-center space-x-4">
                                <div
                                    className="w-6 h-6 rounded-full flex-shrink-0 shadow-md border-2 border-white"
                                    style={{ 
                                        backgroundColor: slice.color,
                                        boxShadow: `0 2px 8px ${slice.color}40`
                                    }}
                                ></div>
                                <span className="font-semibold text-gray-800 text-lg">
                                    {slice.source}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-xl text-gray-800">
                                    {slice.count}
                                </div>
                                <div className="text-sm font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                                    {slice.percentage}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SourceLeadStats;
