export interface GestureState {
  wingAmplitude: number;
  pitch: number;
  yaw: number;
  position: { x: number; y: number; z: number };
}

export const mapLandmarksToGesture = (landmarks: any[]): GestureState => {
  if (!landmarks || landmarks.length === 0) {
    return { wingAmplitude: 0, pitch: 0, yaw: 0, position: { x: 0.5, y: 0.5, z: 0.5 } };
  }

  const wrist = landmarks[0];
  const indexTip = landmarks[8];
  
  // Функция проверки: выпрямлен ли палец (расстояние от кончика до запястья больше, чем от сгиба до запястья)
  const dist = (p1: any, p2: any) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
  const isExtended = (tipIdx: number, pipIdx: number) => dist(landmarks[tipIdx], wrist) > dist(landmarks[pipIdx], wrist);

  const isIndexExtended = isExtended(8, 6);
  const isMiddleFolded = !isExtended(12, 10);
  const isRingFolded = !isExtended(16, 14);
  const isPinkyFolded = !isExtended(20, 18);

  // Жест "Указатель" (выпрямлен только один указательный палец)
  const isPointing = isIndexExtended && isMiddleFolded && isRingFolded && isPinkyFolded;

  if (!isPointing) {
    // Если жест не 1 палец — вертолет ровно стоит и ждет
    return { wingAmplitude: 0, pitch: 0, yaw: 0, position: { x: 0.5, y: 0.5, z: 0.5 } };
  }

  const wingAmplitude = 1.0; // Лопасти крутятся, когда активен 1 палец

  // УПРАВЛЕНИЕ ОДНИМ ПАЛЬЦЕМ (Абсолютные координаты на экране как Джойстик)
  // Центральная точка экрана это 0.5. Мы считаем отклонение от центра.
  const screenX = indexTip.x;
  const screenY = indexTip.y;

  // Если палец левее центра (screenX > 0.5 из-за зеркалки), joystickX будет положительным -> поворот влево.
  const joystickX = (0.5 - screenX) * 2.0; // от -1 до 1
  
  // Если палец выше центра (screenY < 0.5), joystickY будет положительным -> нос вверх.
  const joystickY = (0.5 - screenY) * 2.0; // от -1 до 1
  
  // Применяем умножитель (чувствительность)
  const rawYaw = joystickX * 1.5; // Максимально поворот на ~85 градусов
  const rawPitch = joystickY * 1.0; // Максимально наклон на ~57 градусов

  // CLAMP (Ограничение углов)
  const pitch = Math.max(-0.8, Math.min(0.8, rawPitch));
  const yaw = Math.max(-1.5, Math.min(1.5, rawYaw));

  // Положение руки в кадре
  const position = {
    x: 1 - indexTip.x, 
    y: 1 - indexTip.y, 
    z: Math.max(0, Math.min(1, Math.abs(indexTip.z) * 5))
  };

  return { wingAmplitude, pitch, yaw, position };
};
