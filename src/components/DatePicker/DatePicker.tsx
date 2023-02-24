import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import css from "./main.module.css";

import CalendarIcon from "./calender-icon.svg";
import { Calender } from "./Calender";

const rybDate = (dateObj: Date) => {
  return [
    String(dateObj.getDate()).padStart(2, "0"),
    String(dateObj.getMonth() + 1).padStart(2, "0"),
    dateObj.getFullYear(),
  ].join(".");
};
export interface DatePickerProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export const DatePicker = (props: DatePickerProps) => {
  const { date, setDate } = props;
  const [inputV, setInputV] = useState(date ? rybDate(date) : "");
  const [validDate, setValidDate] = useState(date);
  const [errorInput, setErrorInput] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [onBottom, setOnBottom] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const calendarSize = {
    width: 250,
    height: 250,
  };
  const onchangeWindowSize = useCallback(() => {
    if (!inputRef.current) return;
    const { top, bottom } = inputRef.current.getBoundingClientRect();
    const body = document.body,
      html = document.documentElement;
    const documentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    setOnBottom(
      documentHeight - (bottom + calendarSize.height) > 0 ||
        top < calendarSize.height
    );
  }, [calendarSize.height]);
  useEffect(() => {
    onchangeWindowSize();
    window.addEventListener("load", onchangeWindowSize);
    window.addEventListener("resize", onchangeWindowSize);
    return () => {
      window.removeEventListener("resize", onchangeWindowSize);
      window.removeEventListener("load", onchangeWindowSize);
    };
  }, [onchangeWindowSize]);
  const isCalenderIcon = (element: HTMLElement): boolean => {
    if (element.classList.contains(css.calenderIcon)) {
      return true;
    }
    if (element.parentElement) {
      return isCalenderIcon(element.parentElement);
    } else {
      return false;
    }
  };

  useEffect(() => {
    document.getElementById("root");
    const isCalenderMain = (element: HTMLElement): boolean => {
      let result = false;

      if (element.classList?.contains(css.calenderMain)) {
        return true;
      }
      if (element.parentElement) {
        return isCalenderMain(element.parentElement);
      } else {
        return result;
      }
    };

    const outSideClickHandler = (event: MouseEvent) => {
      if (!event.target) return;
      const targetElement = event.target as HTMLElement;

      if (
        !(
          isCalenderMain(targetElement) ||
          targetElement.classList?.contains(css.calenderInput) ||
          isCalenderIcon(targetElement)
        )
      )
        setShowCalendar(false);
    };
    document.addEventListener("click", outSideClickHandler);
    return () => {
      document.removeEventListener("click", outSideClickHandler);
    };
  }, []);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const targetElement = event.target;
    if (/^\d{2}$/.test(targetElement.value))
      setInputV((e) => {
        if (/^\d{2}\.$/.test(e)) return targetElement.value[0];
        else return targetElement.value + ".";
      });
    else if (/^\d{2}\.\d{2}$/.test(targetElement.value))
      setInputV((e) => {
        if (/^\d{2}\.\d{2}\.$/.test(e)) return targetElement.value.slice(0, 4);
        else return targetElement.value + ".";
      });
    else if (targetElement.value.length > 10) {
      return;
    } else setInputV(() => targetElement.value);

    if (targetElement.value.length === 10) {
      if (!/^\d{2}\.\d{2}\.\d{4}$/.test(targetElement.value)) {
        setErrorInput(() => true);
      }
      if (new Date(targetElement.value.length)) {
        const newDate = new Date(
          targetElement.value.split(".").reverse().join("-")
        );
        setValidDate(newDate);
        setDate(newDate);
      }
    } else setErrorInput(() => false);
  };
  const width = calendarSize.width + "px";
  const height = calendarSize.height + "px";

  const onDateSelection = (newDate: Date) => {
    setInputV(rybDate(newDate));
    setShowCalendar(false);
    setValidDate(newDate);
    setDate(newDate);
  };
  const calender = (
    <div className={css.calenderMain}>
      <Calender
        onDateClick={onDateSelection}
        width={width}
        height={height}
        selectedDate={validDate}
      />
    </div>
  );
  const cssStyle = [css.calenderInput];
  if (errorInput) cssStyle.push(css.errorInput);
  cssStyle.push("pl-3 pr-0");

  return (
    <div className={css.datePickerContainer}>
      {showCalendar && !onBottom && (
        <div className={css.onTopParent}>{calender}</div>
      )}
      <div className={css.inputContainer}>
        <input
          placeholder={"ДД.ММ.ГГГГ"}
          ref={inputRef}
          onFocus={() => {
            setShowCalendar(true);
          }}
          className={cssStyle.join(" ")}
          value={inputV}
          onKeyDown={(event) => {
            if (!/\d|Backspace|Delete|\.|Arrow/.test(event.key))
              event.preventDefault();
            const { value } = event.target as HTMLInputElement;
            if (event.key === "." && !/^\d{2}$/.test(value))
              event.preventDefault();
          }}
          onChange={onChange}
        />
        <div
          title={"Показать клендарь"}
          onClick={(event) => {
            setShowCalendar(true);
          }}
          className={css.calenderIcon}
        >
          <CalendarIcon />
        </div>
      </div>
      {showCalendar && onBottom && (
        <div className={css.onBottomParent}>{calender}</div>
      )}
    </div>
  );
};
