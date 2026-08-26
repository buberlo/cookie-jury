import { useMemo } from 'react';

const DEFAULT_LABEL = 'clean-cookie streak';

function toFiniteNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? Math.max(0, Math.floor(num)) : fallback;
}

function normalizeStreak(value) {
  if (value == null) {
    return {
      count: 0,
      best: 0,
      lastClearedAt: null,
      label: DEFAULT_LABEL,
    };
  }

  if (typeof value === 'number') {
    const count = toFiniteNumber(value);
    return {
      count,
      best: count,
      lastClearedAt: null,
      label: DEFAULT_LABEL,
    };
  }

  if (typeof value === 'object') {
    const count = toFiniteNumber(
      value.count ?? value.streak ?? value.days ?? value.current,
      0
    );
    const best = toFiniteNumber(
      value.best ?? value.bestStreak ?? value.longest ?? count,
      count
    );
    const lastClearedAt =
      value.lastClearedAt ?? value.lastCleared ?? value.updatedAt ?? null;
    const label =
      typeof value.label === 'string' && value.label.trim()
        ? value.label
        : DEFAULT_LABEL;

    return {
      count,
      best,
      lastClearedAt,
      label,
    };
  }

  return {
    count: 0,
    best: 0,
    lastClearedAt: null,
    label: DEFAULT_LABEL,
  };
}

function formatLastCleared(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function StreakBadge({
  streak,
  label,
  compact = false,
  showBest = false,
  className = '',
  title,
}) {
  const data = useMemo(() => normalizeStreak(streak), [streak]);

  const displayLabel = label ?? data.label;
  const active = data.count > 0;
  const lastCleared = formatLastCleared(data.lastClearedAt);
  const unit = data.count === 1 ? 'day' : 'days';

  const baseTitle = active
    ? `${data.count} ${unit} ${displayLabel}`
    : `No active ${displayLabel}`;

  const resolvedTitle =
    title ??
    (lastCleared
      ? `${baseTitle} · last cleared ${lastCleared}`
      : baseTitle);

  const classes = [
    'streak-badge',
    compact ? 'streak-badge--compact' : '',
    active ? 'streak-badge--active' : 'streak-badge--idle',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-streak={data.count}
    >
      <span className="streak-badge__icon" aria-hidden="true">
        {active ? '🔥' : '🍪'}
      </span>
      <span className="streak-badge__count">{data.count}</span>

      {!compact && (
        <span className="streak-badge__label">{displayLabel}</span>
      )}

      {!compact && showBest && (
        <span className="streak-badge__best">best {data.best}</span>
      )}
    </span>
  );
}