const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

if (!content.includes("import { HandTracking }")) {
  content = content.replace("import { SimulatorScene }", "import { HandTracking } from '../components/HandTracking';\nimport { GestureState } from '../components/HandTracking/GestureMapper';\nimport { SimulatorScene }");
}

const handleGestureLogic = `
  const handleGesture = (gesture: GestureState) => {
    if (gesture.wingAmplitude === 0 && gesture.pitch === 0) return;
    
    // 1. Раскрытие ладони -> Скорость ротора (взмах крыльев)
    setRotorRPM(100 + gesture.wingAmplitude * 700);
    
    // 2. Наклон кисти (вперед/назад) -> Наклон вертолета (Тангаж)
    setBankBias(gesture.pitch);
    
    // 3. Положение руки (Y) -> Высота
    setAltitude(5 + (1 - gesture.position.y) * 95);
    
    // 4. Положение руки (X) -> Скорость
    setSpeed(gesture.position.x * 200);
  };
`;

if (!content.includes("const handleGesture = ")) {
  const insertIndex = content.indexOf("return (");
  content = content.substring(0, insertIndex) + handleGestureLogic + '\n  ' + content.substring(insertIndex);
}

const componentHTML = `
            <HandTracking onGestureUpdate={handleGesture} className="mb-8" />
`;
const insertionPoint = content.indexOf('<div className="control-group">');
if (insertionPoint !== -1 && !content.includes("<HandTracking")) {
  content = content.substring(0, insertionPoint) + componentHTML + '\n            ' + content.substring(insertionPoint);
}

fs.writeFileSync('src/app/App.tsx', content, 'utf8');
console.log("Updated App.tsx");
