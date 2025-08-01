import { operations, solvedCube } from "./constants";

const addButton = (parent, label, onClick, className) => {
    var button = document.createElement("button");
    button.className = "pure-button";
    if (className) {
        button.classList.add(className);
    }
    button.innerText = label;
    button.addEventListener("click", onClick);
    parent.appendChild(button);
    return button;
};

const addBrandingLink = (parent) => {
    var link = document.createElement("div");
    link.style.cssText = `
        color: white;
        font-weight: bold;
        font-size: 1.2em;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        padding: 8px 12px;
        background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
    `;
    link.innerText = "CubeMaster Pro";
    parent.appendChild(link);
    return link;
};

const addSlider = (parent, labelText, onChange) => {
    var container = document.createElement("div");
    container.className = "slider-container";
    var slider = document.createElement("input");
    var label = document.createElement("span");
    label.className = "slider-label";
    label.innerText = labelText;
    slider.type = "range";
    slider.min = 1;
    slider.max = 10;
    slider.value = 1;
    slider.className = "slider";
    slider.oninput = function () {
        onChange(this.value);
    };
    container.appendChild(label);
    container.appendChild(slider);
    parent.appendChild(container);
    return slider;
};

export const createControls = (state) => {
    var target = document.querySelector("body");
    var topBar = document.createElement("div");
    topBar.id = "top-bar";
    var bottomBar = document.createElement("div");
    bottomBar.id = "bottom-bar";
    var rightBar = document.createElement("div");
    rightBar.id = "right-bar";

    var currentOperations = [];
    var remainingOperations = [];
    var extraButtonsHidden = true;
    var runtime = null;

    const createOperationButton = (parent, operation) => {
        return addButton(parent, operation.displayName, () => {
            if (remainingOperations.length > 0) {
                currentOperations = [];
                remainingOperations = [];
                state.clearQueue();
            }
            currentOperations.push(operation);
            state.enqueueOperation(operation);
        });
    };

    const clearButton = addButton(topBar, "Reset", () => {
        currentOperations = [];
        remainingOperations = [];
        state.clearQueue();
        state.setColors(solvedCube);
    });
    const demoButton = addButton(topBar, "Demo", () => {
        currentOperations = [...operations];
        remainingOperations = [];
        state.enqueueOperation(...currentOperations);
    });
    const pauseButton = addButton(topBar, "Pause", () => {
        remainingOperations = [...state.operationQueue];
        state.clearQueue();
    });
    const resumeButton = addButton(topBar, "Resume", () => {
        state.enqueueOperation(...remainingOperations);
        remainingOperations = [];
    });
    const scrambleButton = addButton(topBar, "Scramble", async () => {
        const scramble = await runtime.generateScramble(25, true);

        remainingOperations = [];
        currentOperations = scramble.map((c) =>
            operations.find(({ code }) => code === c)
        );
        state.enqueueOperation(...currentOperations);
    });
    const solveButton = addButton(topBar, "Solve", async () => {
        const solveAlgorithm = await runtime.solve(state.currentCube);

        remainingOperations = [];
        currentOperations = solveAlgorithm.map((c) =>
            operations.find(({ code }) => code === c)
        );
        state.enqueueOperation(...currentOperations);
    });
    addSlider(topBar, "Animation Speed", (speed) => {
        state.animationSpeed = speed;
    });
    addBrandingLink(topBar);

    const algorithm = document.createElement("div");
    algorithm.id = "algorithm";
    topBar.appendChild(algorithm);

    const operationButtons = operations
        .filter(({ category }) => category === "Basic")
        .map((operation) => createOperationButton(bottomBar, operation));

    const extraButtons = operations
        .filter(({ category }) => category !== "Basic")
        .map((operation) => createOperationButton(bottomBar, operation));

    const moreOperationsButton = addButton(
        bottomBar,
        "More...",
        () => {
            extraButtonsHidden = false;
            updateControls();
        },
        "more-less-button"
    );

    const lessOperationsButton = addButton(
        bottomBar,
        "Less...",
        () => {
            extraButtonsHidden = true;
            updateControls();
        },
        "more-less-button"
    );

    const updateControls = async () => {
        const isRunning = state.currentAnimation !== null;
        const hasElementsInQueue = state.operationQueue.length !== 0;

        if (runtime) {
            algorithm.innerHTML = "";
            for (var i = 0; i < currentOperations.length; ++i) {
                const node = document.createElement("a");
                node.classList.add("algorithm-link");
                node.innerText = currentOperations[i].displayName;

                const remainingOperationsCount =
                    state.operationQueue.length + remainingOperations.length;
                const currentPosition =
                    currentOperations.length - remainingOperationsCount - 1;

                if (isRunning && i == currentPosition) {
                    node.classList.add("algorithm-current");
                } else if (i <= currentPosition) {
                    node.classList.add("algorithm-done");
                }

                const delta = i - currentPosition;
                if (delta !== 0 && !isRunning) {
                    node.href = "#";
                    node.onclick = async () => {
                        if (delta > 0) {
                            const toExecute = currentOperations.slice(
                                currentPosition + 1,
                                currentPosition + delta + 1
                            );
                            remainingOperations.splice(0, delta);

                            state.setColors(
                                await runtime.performAlgorithm(
                                    state.currentCube,
                                    toExecute.map(({ code }) => code)
                                )
                            );
                        } else {
                            const toExecute = currentOperations.slice(
                                currentPosition + delta + 1,
                                currentPosition + 1
                            );
                            remainingOperations.unshift(...toExecute);
                            state.setColors(
                                await runtime.performAlgorithm(
                                    state.currentCube,
                                    await runtime.invertAlgorithm(
                                        toExecute.map(({ code }) => code)
                                    )
                                )
                            );
                        }
                    };
                }
                algorithm.appendChild(node);
            }
        }

        [
            clearButton,
            demoButton,
            scrambleButton,
            resumeButton,
            ...operationButtons,
            ...extraButtons,
        ].forEach((button) => {
            button.disabled = isRunning || !runtime;
        });
        pauseButton.disabled = !isRunning || !hasElementsInQueue || !runtime;
        extraButtons.forEach((button) => {
            button.hidden = extraButtonsHidden;
        });
        moreOperationsButton.hidden = !extraButtonsHidden;
        lessOperationsButton.hidden = extraButtonsHidden;
        algorithm.hidden = currentOperations.length === 0;
        resumeButton.hidden = isRunning || remainingOperations.length === 0;
        pauseButton.hidden = !isRunning && remainingOperations.length > 0;
        solveButton.disabled =
            isRunning ||
            !runtime ||
            (await runtime.isSolved(state.currentCube));
    };
    updateControls();

    state.addChangeListener(updateControls);
    state.runtimePromise.then(([result]) => {
        runtime = result;
        updateControls();
    });

    target.appendChild(topBar);
    target.appendChild(bottomBar);
    target.appendChild(rightBar);
};
