import { COLORS } from '../engine/constants.js';

interface ColorPickerProps {
  selectedColor: number;
  colorCount: number;
  onSelect: (colorIndex: number) => void;
}

export function ColorPicker({ selectedColor, colorCount, onSelect }: ColorPickerProps) {
  const availableColors = COLORS.slice(0, colorCount);

  return (
    <div className="gl-color-picker">
      {availableColors.map((color) => (
        <button
          key={color.index}
          className={`gl-color-swatch ${selectedColor === color.index ? 'gl-color-selected' : ''}`}
          style={{
            backgroundColor: color.hex,
            width: 40,
            height: 40,
            border: selectedColor === color.index ? '3px solid #ffffff' : '2px solid transparent',
            borderRadius: 8,
            cursor: 'pointer',
            outline: selectedColor === color.index ? '2px solid #64ffda' : 'none',
            outlineOffset: 2,
            transition: 'all 0.15s ease',
          }}
          onClick={() => onSelect(color.index)}
          title={color.name}
          aria-label={`Select ${color.name} color`}
        />
      ))}
    </div>
  );
}
