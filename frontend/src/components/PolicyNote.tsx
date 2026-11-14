/* Nota de política de acceso (RF-SU: sin registros externos, uso exclusivo admin). */
export default function PolicyNote() {
  return (
    <div className="policy-note">
      <span className="material-symbols-outlined" aria-hidden="true">
        shield_person
      </span>
      <p>
        Acceso exclusivo para <strong>personal administrativo acreditado</strong>. No se admiten
        registros externos.
      </p>
    </div>
  );
}
