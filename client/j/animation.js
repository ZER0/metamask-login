class AnimationHandler {
  constructor(element) {
    this.element = element;
  }

  starts(name) {
    return new Promise((resolve) =>
      this.element.addEventListener(
        "animationstart",
        (e) => {
          if (e.animationName === name) {
            resolve();
          }
        },
        { once: true }
      )
    );
  }

  ends(name) {
    return new Promise((resolve) =>
      this.element.addEventListener(
        "animationend",
        (e) => {
          if (e.animationName === name) {
            resolve();
          }
        },
        { once: true }
      )
    );
  }
}

export const when = (el) => new AnimationHandler(el);
