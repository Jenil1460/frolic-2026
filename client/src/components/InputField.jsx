import './InputField.css';

const InputField = ({ 
  icon: Icon, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  name,
  required = false,
  rightIcon: RightIcon,
  onRightIconClick
}) => {
  return (
    <div className="input-field">
      <div className="input-icon-left">
        {Icon && <Icon size={20} />}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        className="input"
      />
      {RightIcon && (
        <button 
          type="button"
          className="input-icon-right"
          onClick={onRightIconClick}
          aria-label="Toggle visibility"
        >
          <RightIcon size={20} />
        </button>
      )}
    </div>
  );
};

export default InputField;