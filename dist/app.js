import { selectTools, getDestination } from './catalog.mjs';

const controls = document.querySelector('.directory-controls');

if (controls) {
  const grid = document.querySelector('.project-grid');
  const tools = [...grid.querySelectorAll('.project')].map(element => ({
    name: element.dataset.name,
    subject: element.dataset.subject,
    element,
  }));
  const buttons = [...controls.querySelectorAll('[data-subject]')];
  const sort = document.querySelector('#sort');
  const empty = document.querySelector('.empty-state');
  const count = document.querySelector('.result-count');
  let subject = new URLSearchParams(location.search).get('subject') || 'all';
  if (!buttons.some(button => button.dataset.subject === subject)) subject = 'all';

  function render() {
    const selected = selectTools(tools, subject, sort.value);
    const visible = new Set(selected);
    tools.forEach(tool => { tool.element.hidden = !visible.has(tool); });
    selected.forEach(tool => grid.append(tool.element));
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.subject === subject)));
    count.textContent = `${selected.length} ${selected.length === 1 ? 'tool' : 'tools'}`;
    grid.hidden = selected.length === 0;
    empty.hidden = selected.length !== 0;
    if (!selected.length) {
      const label = buttons.find(button => button.dataset.subject === subject).textContent;
      document.querySelector('#empty-title').textContent = `${label} tools are on the list.`;
      document.querySelector('#empty-description').textContent = 'We’re planning to expand into this subject. Explore the published tools in the meantime.';
    }
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    subject = button.dataset.subject;
    render();
  }));
  sort.addEventListener('change', render);
  document.querySelector('#reset-filters').addEventListener('click', () => {
    subject = 'all';
    render();
    buttons[0].focus();
  });
  render();
  controls.hidden = false;
}

// Keep real destination links in the HTML for no-JavaScript navigation.
document.querySelectorAll('.tool-link').forEach(link => {
  const id = link.dataset.tool;
  if (getDestination(id)?.url === link.href) {
    link.href = `open.html?tool=${encodeURIComponent(id)}`;
  }
});

const handoff = document.querySelector('.handoff');
if (handoff) {
  const destination = getDestination(new URLSearchParams(location.search).get('tool'));
  const title = document.querySelector('#handoff-title');
  const detail = document.querySelector('#handoff-detail');
  document.querySelector('.skeleton').hidden = true;

  if (!destination) {
    title.textContent = 'This tool link isn’t available.';
    detail.textContent = 'Choose a published tool from the study tools page.';
    document.querySelector('.handoff-progress').hidden = true;
  } else {
    title.textContent = `Opening ${destination.name}`;
    detail.textContent = new URL(destination.url).hostname;
    const direct = document.querySelector('#continue-link');
    direct.href = destination.url;
    direct.hidden = false;
    const go = () => location.replace(destination.url);
    const progress = document.querySelector('.handoff-progress span');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !progress.animate) {
      go();
    } else {
      const animation = progress.animate(
        [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        { duration: 360, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' },
      );
      // Cancellation must not strand a visitor on the transition page.
      animation.finished.then(go, go);
    }
  }
}
