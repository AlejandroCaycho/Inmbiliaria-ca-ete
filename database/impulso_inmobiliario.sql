BEGIN;

SET client_encoding = 'UTF8';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP VIEW IF EXISTS
  vw_site_content,
  vw_properties_published,
  vw_properties_detail,
  vw_properties,
  vw_property_images,
  vw_media_images,
  vw_featured_home,
  vw_featured_highlights,
  vw_method_phases,
  vw_contact,
  vw_leads,
  vw_leads_inbox,
  vw_dashboard_metrics,
  vw_leads_daily,
  vw_zone_portfolio,
  vw_zone_demand,
  vw_inquiry_type_counts,
  vw_property_inquiry_counts,
  vw_catalog_filters,
  vw_app_users
CASCADE;

DROP TABLE IF EXISTS
  leads,
  featured_highlights,
  featured_home,
  property_images,
  properties,
  media_assets,
  method_phases,
  site_contact,
  inquiry_types,
  zones,
  operations,
  property_groups,
  app_users
CASCADE;

DROP FUNCTION IF EXISTS set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS normalize_lead_property() CASCADE;

CREATE TABLE app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(180) NOT NULL,
  password_hash text NOT NULL,
  full_name varchar(120) NOT NULL,
  role varchar(20) NOT NULL DEFAULT 'advisor',
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT app_users_role_check CHECK (role IN ('admin', 'advisor')),
  CONSTRAINT app_users_email_check CHECK (email ~* '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'),
  CONSTRAINT app_users_full_name_check CHECK (btrim(full_name) <> '')
);

CREATE UNIQUE INDEX app_users_email_lower_key ON app_users (lower(email));

CREATE TABLE property_groups (
  id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug varchar(30) NOT NULL UNIQUE,
  label_es varchar(60) NOT NULL,
  label_en varchar(60) NOT NULL,
  position smallint NOT NULL DEFAULT 0,
  CONSTRAINT property_groups_slug_check CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE TABLE operations (
  id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug varchar(30) NOT NULL UNIQUE,
  label_es varchar(60) NOT NULL,
  label_en varchar(60) NOT NULL,
  position smallint NOT NULL DEFAULT 0,
  CONSTRAINT operations_slug_check CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE TABLE zones (
  id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug varchar(40) NOT NULL UNIQUE,
  label_es varchar(80) NOT NULL,
  label_en varchar(80) NOT NULL,
  position smallint NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT zones_slug_check CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE TABLE media_assets (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  src text NOT NULL UNIQUE,
  label_es text NOT NULL,
  label_en text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT media_assets_src_check CHECK (btrim(src) <> ''),
  CONSTRAINT media_assets_label_es_check CHECK (btrim(label_es) <> ''),
  CONSTRAINT media_assets_label_en_check CHECK (btrim(label_en) <> '')
);

CREATE TABLE properties (
  id varchar(40) PRIMARY KEY,
  ref varchar(100) NOT NULL,
  ref_en varchar(100),
  name_es varchar(200) NOT NULL,
  name_en varchar(200),
  description_es text,
  description_en text,
  meta_es varchar(200),
  meta_en varchar(200),
  price_text_es varchar(120) NOT NULL,
  price_text_en varchar(120),
  price_amount numeric(14, 2),
  currency char(3),
  image_src text NOT NULL REFERENCES media_assets(src) ON UPDATE CASCADE ON DELETE RESTRICT,
  alt_es text,
  alt_en text,
  group_id smallint NOT NULL REFERENCES property_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  zone_id smallint NOT NULL REFERENCES zones(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  location_es varchar(180),
  location_en varchar(180),
  operation_id smallint NOT NULL REFERENCES operations(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT properties_id_check CHECK (btrim(id) <> ''),
  CONSTRAINT properties_ref_check CHECK (btrim(ref) <> ''),
  CONSTRAINT properties_name_es_check CHECK (btrim(name_es) <> ''),
  CONSTRAINT properties_price_text_es_check CHECK (btrim(price_text_es) <> ''),
  CONSTRAINT properties_currency_check CHECK (currency IS NULL OR currency IN ('PEN', 'USD')),
  CONSTRAINT properties_price_amount_check CHECK (price_amount IS NULL OR price_amount >= 0),
  CONSTRAINT properties_price_currency_check CHECK (price_amount IS NULL OR currency IS NOT NULL),
  CONSTRAINT properties_sort_order_check CHECK (sort_order >= 0)
);

CREATE TABLE property_images (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  property_id varchar(40) NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
  media_src text NOT NULL REFERENCES media_assets(src) ON UPDATE CASCADE ON DELETE RESTRICT,
  position smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT property_images_unique UNIQUE (property_id, media_src),
  CONSTRAINT property_images_position_check CHECK (position >= 0)
);

CREATE TABLE featured_home (
  id smallint PRIMARY KEY DEFAULT 1,
  property_id varchar(40) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE SET NULL,
  image_src text REFERENCES media_assets(src) ON UPDATE CASCADE ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT featured_home_singleton CHECK (id = 1)
);

CREATE TABLE featured_highlights (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  featured_id smallint NOT NULL DEFAULT 1 REFERENCES featured_home(id) ON UPDATE CASCADE ON DELETE CASCADE,
  position smallint NOT NULL,
  text_es text NOT NULL,
  text_en text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT featured_highlights_position_check CHECK (position BETWEEN 1 AND 6),
  CONSTRAINT featured_highlights_text_es_check CHECK (btrim(text_es) <> ''),
  CONSTRAINT featured_highlights_unique UNIQUE (featured_id, position)
);

CREATE TABLE method_phases (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  number varchar(2) NOT NULL UNIQUE,
  position smallint NOT NULL DEFAULT 0,
  title_es text NOT NULL,
  title_en text,
  you_es text NOT NULL,
  you_en text,
  us_es text NOT NULL,
  us_en text,
  time_es text,
  time_en text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT method_phases_number_check CHECK (number ~ '^[0-9]{2}$'),
  CONSTRAINT method_phases_title_es_check CHECK (btrim(title_es) <> ''),
  CONSTRAINT method_phases_you_es_check CHECK (btrim(you_es) <> ''),
  CONSTRAINT method_phases_us_es_check CHECK (btrim(us_es) <> '')
);

CREATE TABLE site_contact (
  id smallint PRIMARY KEY DEFAULT 1,
  phone varchar(40) NOT NULL,
  whatsapp varchar(30) NOT NULL,
  instagram_handle varchar(100),
  instagram_url text,
  tiktok_handle varchar(100),
  tiktok_url text,
  service_location varchar(180),
  service_area varchar(180),
  visits_note varchar(180),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_contact_singleton CHECK (id = 1),
  CONSTRAINT site_contact_phone_check CHECK (btrim(phone) <> ''),
  CONSTRAINT site_contact_whatsapp_check CHECK (whatsapp ~ '^[0-9]{6,20}$')
);

CREATE TABLE inquiry_types (
  id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug varchar(40) NOT NULL UNIQUE,
  label_es varchar(120) NOT NULL UNIQUE,
  label_en varchar(120) NOT NULL,
  hint_es varchar(180),
  hint_en varchar(180),
  position smallint NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT inquiry_types_slug_check CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT inquiry_types_label_es_check CHECK (btrim(label_es) <> '')
);

CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id varchar(40) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE SET NULL,
  inquiry_type_id smallint REFERENCES inquiry_types(id) ON UPDATE CASCADE ON DELETE SET NULL,
  name varchar(160) NOT NULL,
  email varchar(180),
  phone varchar(40),
  message text,
  message_en text,
  lang varchar(5) NOT NULL DEFAULT 'es',
  status varchar(10) NOT NULL DEFAULT 'nueva',
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  attended_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_name_check CHECK (btrim(name) <> ''),
  CONSTRAINT leads_email_check CHECK (email IS NULL OR email = '' OR email ~* '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'),
  CONSTRAINT leads_phone_check CHECK (phone IS NULL OR phone = '' OR phone ~ '^[0-9+() .-]{6,40}$'),
  CONSTRAINT leads_lang_check CHECK (lang IN ('es', 'en')),
  CONSTRAINT leads_status_check CHECK (status IN ('nueva', 'atendida'))
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION normalize_lead_property()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.property_id = 'Otra consulta' THEN
    NEW.property_id := NULL;
  END IF;

  IF NEW.status = 'atendida' AND NEW.attended_at IS NULL THEN
    NEW.attended_at := now();
  ELSIF NEW.status = 'nueva' THEN
    NEW.attended_at := NULL;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER app_users_set_updated_at
BEFORE UPDATE ON app_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER properties_set_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER featured_home_set_updated_at
BEFORE UPDATE ON featured_home
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER method_phases_set_updated_at
BEFORE UPDATE ON method_phases
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER site_contact_set_updated_at
BEFORE UPDATE ON site_contact
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER leads_normalize
BEFORE INSERT OR UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION normalize_lead_property();

CREATE INDEX properties_published_idx ON properties (published, sort_order, id);
CREATE INDEX properties_zone_idx ON properties (zone_id);
CREATE INDEX properties_group_idx ON properties (group_id);
CREATE INDEX properties_operation_idx ON properties (operation_id);
CREATE INDEX property_images_property_idx ON property_images (property_id, position);
CREATE INDEX featured_highlights_featured_idx ON featured_highlights (featured_id, position);
CREATE INDEX method_phases_position_idx ON method_phases (position);
CREATE INDEX inquiry_types_position_idx ON inquiry_types (position);
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX leads_status_idx ON leads (status);
CREATE INDEX leads_property_idx ON leads (property_id);
CREATE INDEX leads_inquiry_type_idx ON leads (inquiry_type_id);

CREATE VIEW vw_media_images AS
SELECT
  src,
  label_es AS label,
  label_en AS "labelEn"
FROM media_assets
WHERE is_active
ORDER BY id;

CREATE VIEW vw_property_images AS
SELECT
  p.id AS "propertyId",
  m.src,
  m.label_es AS label,
  m.label_en AS "labelEn"
FROM properties p
JOIN property_images pi ON pi.property_id = p.id
JOIN media_assets m ON m.src = pi.media_src
WHERE m.is_active
ORDER BY p.sort_order, p.id, pi.position;

CREATE VIEW vw_properties AS
SELECT
  p.id,
  p.ref,
  COALESCE(NULLIF(btrim(p.ref_en), ''), p.ref) AS "refEn",
  p.name_es AS name,
  COALESCE(NULLIF(btrim(p.name_en), ''), p.name_es) AS "nameEn",
  COALESCE(p.description_es, '') AS description,
  COALESCE(NULLIF(btrim(p.description_en), ''), p.description_es, '') AS "descriptionEn",
  COALESCE(p.meta_es, '') AS meta,
  COALESCE(NULLIF(btrim(p.meta_en), ''), p.meta_es, '') AS "metaEn",
  p.price_text_es AS price,
  COALESCE(NULLIF(btrim(p.price_text_en), ''), p.price_text_es) AS "priceEn",
  p.image_src AS image,
  COALESCE(NULLIF(btrim(p.alt_es), ''), p.name_es) AS alt,
  COALESCE(NULLIF(btrim(p.alt_en), ''), NULLIF(btrim(p.alt_es), ''), NULLIF(btrim(p.name_en), ''), p.name_es) AS "altEn",
  g.slug AS "group",
  z.label_es AS zone,
  COALESCE(p.location_es, '') AS location,
  COALESCE(NULLIF(btrim(p.location_en), ''), p.location_es, '') AS "locationEn",
  o.slug AS operation,
  p.published
FROM properties p
JOIN property_groups g ON g.id = p.group_id
JOIN zones z ON z.id = p.zone_id
JOIN operations o ON o.id = p.operation_id
ORDER BY p.sort_order, p.id;

CREATE VIEW vw_properties_published AS
SELECT p.*
FROM vw_properties p
JOIN properties raw ON raw.id = p.id
WHERE p.published
ORDER BY raw.sort_order, raw.id;

CREATE VIEW vw_properties_detail AS
SELECT
  p.*,
  raw.price_amount,
  raw.currency,
  raw.sort_order,
  raw.created_at,
  raw.updated_at,
  z.slug AS zone_slug,
  g.slug AS group_slug,
  o.slug AS operation_slug
FROM vw_properties p
JOIN properties raw ON raw.id = p.id
JOIN property_groups g ON g.id = raw.group_id
JOIN zones z ON z.id = raw.zone_id
JOIN operations o ON o.id = raw.operation_id
ORDER BY raw.sort_order, raw.id;

CREATE VIEW vw_featured_home AS
SELECT
  f.property_id AS "propertyId",
  COALESCE(f.image_src, p.image_src) AS image,
  COALESCE((
    SELECT jsonb_agg(
      jsonb_build_object('es', h.text_es, 'en', COALESCE(NULLIF(btrim(h.text_en), ''), h.text_es))
      ORDER BY h.position
    )
    FROM featured_highlights h
    WHERE h.featured_id = f.id
  ), '[]'::jsonb) AS highlights
FROM featured_home f
LEFT JOIN properties p ON p.id = f.property_id
WHERE f.id = 1;

CREATE VIEW vw_featured_highlights AS
SELECT
  position,
  text_es AS es,
  COALESCE(NULLIF(btrim(text_en), ''), text_es) AS en
FROM featured_highlights
WHERE featured_id = 1
ORDER BY position;

CREATE VIEW vw_method_phases AS
SELECT
  number,
  title_es AS title,
  COALESCE(NULLIF(btrim(title_en), ''), title_es) AS "titleEn",
  you_es AS "you",
  COALESCE(NULLIF(btrim(you_en), ''), you_es) AS "youEn",
  us_es AS "us",
  COALESCE(NULLIF(btrim(us_en), ''), us_es) AS "usEn",
  time_es AS "time",
  COALESCE(NULLIF(btrim(time_en), ''), time_es) AS "timeEn"
FROM method_phases
WHERE is_active
ORDER BY position, number;

CREATE VIEW vw_contact AS
SELECT
  phone,
  whatsapp,
  instagram_handle AS "instagramHandle",
  instagram_url AS "instagramUrl",
  tiktok_handle AS "tiktokHandle",
  tiktok_url AS "tiktokUrl"
FROM site_contact
WHERE id = 1;

CREATE VIEW vw_catalog_filters AS
SELECT
  jsonb_build_array(
    jsonb_build_object('value', 'todas', 'label', 'Todas las propiedades', 'labelEn', 'All properties'),
    jsonb_build_object('value', 'casa-venta', 'label', 'Casa en venta', 'labelEn', 'Home for sale'),
    jsonb_build_object('value', 'casa-alquiler', 'label', 'Casa en alquiler', 'labelEn', 'Home for rent'),
    jsonb_build_object('value', 'terreno', 'label', 'Terreno', 'labelEn', 'Land'),
    jsonb_build_object('value', 'proyecto', 'label', 'Proyecto frente al mar', 'labelEn', 'Beachfront project')
  ) AS tipologias,
  jsonb_build_array(
    jsonb_build_object('value', 'todas', 'label', 'Todas las zonas', 'labelEn', 'All areas')
  ) || COALESCE((
    SELECT jsonb_agg(
      jsonb_build_object('value', z.slug, 'label', z.label_es, 'labelEn', z.label_en)
      ORDER BY z.position, z.id
    )
    FROM zones z
    WHERE z.is_active
  ), '[]'::jsonb) AS zonas,
  jsonb_build_array(
    jsonb_build_object('value', 'todas', 'label', 'Cualquier tamaño', 'labelEn', 'Any size'),
    jsonb_build_object('value', 'hasta-200', 'label', 'Hasta 200 m²', 'labelEn', 'Up to 200 m²'),
    jsonb_build_object('value', '200-500', 'label', '200 m² — 500 m²', 'labelEn', '200 m² — 500 m²'),
    jsonb_build_object('value', '500-1000', 'label', '500 m² — 1,000 m²', 'labelEn', '500 m² — 1,000 m²'),
    jsonb_build_object('value', '1000+', 'label', 'Más de 1,000 m²', 'labelEn', 'Over 1,000 m²')
  ) AS superficies,
  jsonb_build_array(
    jsonb_build_object('value', 'todos', 'label', 'Cualquier monto', 'labelEn', 'Any budget'),
    jsonb_build_object('value', 'hasta-50k', 'label', 'Hasta S/ 50,000', 'labelEn', 'Up to S/ 50,000'),
    jsonb_build_object('value', '50k-100k', 'label', 'S/ 50,000 — 100,000', 'labelEn', 'S/ 50,000 — 100,000'),
    jsonb_build_object('value', '100k-200k', 'label', 'US$ 100,000 — 200,000', 'labelEn', 'US$ 100,000 — 200,000'),
    jsonb_build_object('value', 'consultar', 'label', 'A consultar', 'labelEn', 'Price on request')
  ) AS presupuestos;

CREATE VIEW vw_leads AS
SELECT
  l.id::text AS id,
  l.name,
  COALESCE(l.email, '') AS email,
  COALESCE(l.property_id, 'Otra consulta') AS "propertyId",
  COALESCE(it.label_es, 'Otra consulta') AS gestion,
  COALESCE(l.message, '') AS message,
  l.message_en AS "messageEn",
  l.created_at AS "date",
  l.status,
  l.lang,
  l.is_demo AS demo
FROM leads l
LEFT JOIN inquiry_types it ON it.id = l.inquiry_type_id
ORDER BY l.created_at DESC;

CREATE VIEW vw_leads_inbox AS
SELECT
  l.id::text AS id,
  l.name,
  COALESCE(l.email, '') AS email,
  COALESCE(l.phone, '') AS phone,
  COALESCE(l.property_id, 'Otra consulta') AS "propertyId",
  COALESCE(it.label_es, 'Otra consulta') AS gestion,
  COALESCE(it.label_en, 'Other inquiry') AS "gestionEn",
  it.slug AS "gestionSlug",
  COALESCE(l.message, '') AS message,
  l.message_en AS "messageEn",
  l.created_at AS "date",
  l.attended_at AS "attendedAt",
  l.status,
  l.lang,
  l.is_demo AS demo,
  p.ref AS "propertyRef",
  p.name_es AS "propertyName",
  COALESCE(NULLIF(btrim(p.name_en), ''), p.name_es) AS "propertyNameEn",
  p.image_src AS "propertyImage",
  p.price_text_es AS "propertyPrice",
  COALESCE(NULLIF(btrim(p.price_text_en), ''), p.price_text_es) AS "propertyPriceEn",
  z.label_es AS "propertyZone"
FROM leads l
LEFT JOIN inquiry_types it ON it.id = l.inquiry_type_id
LEFT JOIN properties p ON p.id = l.property_id
LEFT JOIN zones z ON z.id = p.zone_id
ORDER BY l.created_at DESC;

CREATE VIEW vw_dashboard_metrics AS
WITH counts AS (
  SELECT
    (SELECT count(*) FROM properties WHERE published) AS published_properties,
    (SELECT count(*) FROM properties p JOIN property_groups g ON g.id = p.group_id WHERE p.published AND g.slug = 'casas') AS homes,
    (SELECT count(*) FROM properties p JOIN property_groups g ON g.id = p.group_id WHERE p.published AND g.slug = 'terrenos') AS land,
    (SELECT count(DISTINCT zone_id) FROM properties WHERE published AND zone_id IS NOT NULL) AS zones,
    (SELECT count(*) FROM properties p JOIN operations o ON o.id = p.operation_id WHERE p.published AND o.slug = 'venta') AS for_sale,
    (SELECT count(*) FROM properties p JOIN operations o ON o.id = p.operation_id WHERE p.published AND o.slug = 'alquiler') AS for_rent,
    (SELECT count(*) FROM leads) AS total_leads,
    (SELECT count(*) FROM leads WHERE status = 'nueva') AS new_leads,
    (SELECT count(*) FROM leads WHERE status = 'atendida') AS attended_leads,
    (SELECT count(*) FROM leads WHERE created_at >= current_date - 6) AS leads_last_7_days,
    (SELECT count(*) FROM leads WHERE status = 'nueva' AND created_at >= current_date - 6) AS new_leads_last_7_days
)
SELECT
  *,
  CASE
    WHEN total_leads = 0 THEN 0
    ELSE round(attended_leads * 100.0 / total_leads)::int
  END AS attention_rate
FROM counts;

CREATE VIEW vw_leads_daily AS
WITH days AS (
  SELECT (current_date - s)::date AS day
  FROM generate_series(0, 6) AS s
)
SELECT
  d.day,
  count(l.id)::int AS total,
  count(l.id) FILTER (WHERE l.status = 'nueva')::int AS "new"
FROM days d
LEFT JOIN leads l
  ON l.created_at >= d.day::timestamptz
 AND l.created_at < (d.day + 1)::timestamptz
GROUP BY d.day
ORDER BY d.day;

CREATE VIEW vw_zone_portfolio AS
SELECT
  z.slug,
  z.label_es AS zone,
  z.label_en AS "zoneEn",
  count(p.id)::int AS total
FROM zones z
LEFT JOIN properties p ON p.zone_id = z.id AND p.published
GROUP BY z.id
HAVING count(p.id) > 0
ORDER BY total DESC, z.label_es;

CREATE VIEW vw_zone_demand AS
SELECT
  z.slug,
  z.label_es AS zone,
  z.label_en AS "zoneEn",
  count(l.id)::int AS total
FROM zones z
JOIN properties p ON p.zone_id = z.id
JOIN leads l ON l.property_id = p.id
GROUP BY z.id
ORDER BY total DESC, z.label_es;

CREATE VIEW vw_inquiry_type_counts AS
SELECT
  it.slug,
  it.label_es AS gestion,
  it.label_en AS "gestionEn",
  count(l.id)::int AS total
FROM inquiry_types it
LEFT JOIN leads l ON l.inquiry_type_id = it.id
GROUP BY it.id
HAVING count(l.id) > 0
ORDER BY total DESC;

CREATE VIEW vw_property_inquiry_counts AS
SELECT
  p.id AS "propertyId",
  p.ref,
  p.name_es AS name,
  COALESCE(NULLIF(btrim(p.name_en), ''), p.name_es) AS "nameEn",
  count(l.id)::int AS inquiries
FROM properties p
LEFT JOIN leads l ON l.property_id = p.id
GROUP BY p.id
ORDER BY inquiries DESC, p.sort_order, p.id;

CREATE VIEW vw_app_users AS
SELECT
  id::text AS id,
  email,
  full_name AS name,
  role,
  is_active,
  last_login_at,
  created_at
FROM app_users
ORDER BY full_name;

CREATE VIEW vw_site_content AS
SELECT
  1 AS version,
  jsonb_build_object(
    'properties', COALESCE((
      SELECT jsonb_agg(to_jsonb(p) ORDER BY raw.sort_order, raw.id)
      FROM vw_properties p
      JOIN properties raw ON raw.id = p.id
    ), '[]'::jsonb),
    'featured', COALESCE((
      SELECT to_jsonb(f)
      FROM vw_featured_home f
      LIMIT 1
    ), '{}'::jsonb),
    'methodPhases', COALESCE((
      SELECT jsonb_agg(to_jsonb(m) ORDER BY m.number)
      FROM vw_method_phases m
    ), '[]'::jsonb),
    'contact', COALESCE((
      SELECT to_jsonb(c)
      FROM vw_contact c
      LIMIT 1
    ), '{}'::jsonb)
  ) AS data;

INSERT INTO property_groups (slug, label_es, label_en, position) VALUES
  ('casas', 'Casa', 'Home', 1),
  ('terrenos', 'Terreno', 'Land', 2);

INSERT INTO operations (slug, label_es, label_en, position) VALUES
  ('venta', 'Venta', 'Sale', 1),
  ('alquiler', 'Alquiler', 'Rent', 2);

INSERT INTO zones (slug, label_es, label_en, position) VALUES
  ('san-vicente', 'San Vicente', 'San Vicente', 1),
  ('cerro-azul', 'Cerro Azul', 'Cerro Azul', 2),
  ('san-luis', 'San Luis', 'San Luis', 3),
  ('chincha', 'Chincha', 'Chincha', 4),
  ('canete', 'Cañete', 'Cañete', 5);

INSERT INTO media_assets (src, label_es, label_en) VALUES
  ('/images/casa-lujo.jpg', 'Casa de Lujo en Cañete — piscina y parrilla', 'Luxury home in Cañete — pool and grill'),
  ('/images/featured-casa-lujo.jpg', 'Casa de Lujo en Cañete — portada', 'Luxury home in Cañete — homepage'),
  ('/images/casa-san-vicente.jpg', 'Casa en San Vicente — piscina y jardín', 'Home in San Vicente — pool and garden'),
  ('/images/casa-alquiler.jpg', 'Casa en alquiler Los Cipreces — sala comedor', 'Home for rent in Los Cipreces — living room'),
  ('/images/kusi-wasi-cerro-azul.jpg', 'Kusi Wasi Cerro Azul — áreas verdes', 'Kusi Wasi Cerro Azul — green areas'),
  ('/images/kusi-wasi-del-mar.jpg', 'Kusi Wasi del Mar — lotes frente al mar', 'Kusi Wasi del Mar — beachfront lots'),
  ('/images/terrenos-san-luis.jpg', 'Terrenos en San Luis de Cañete', 'Land in San Luis de Cañete'),
  ('/images/hero-propiedad.jpg', 'Vista general de la propiedad — portada', 'Property overview — homepage');

INSERT INTO properties (
  id, ref, ref_en, name_es, name_en, description_es, description_en,
  meta_es, meta_en, price_text_es, price_text_en, price_amount, currency,
  image_src, alt_es, alt_en, group_id, zone_id, location_es, location_en,
  operation_id, published, sort_order
) VALUES
  (
    'CAJ-01', 'CAJ-01 · CAÑETE', 'CAJ-01 · CAÑETE',
    'Casa de Lujo en Cañete', 'Luxury Home in Cañete',
    'Cinco dormitorios con baño privado, piscina, terraza, parrilla, bar y búnker. Terreno de 660 m² y cerca de 1,000 m² construidos.',
    'Five bedrooms with private bathrooms, pool, terrace, grill, bar and bunker. A 660 m² lot and nearly 1,000 m² built.',
    '1,000 m² const. · 5 hab', '1,000 m² built · 5 bed',
    'A consultar', 'Price on request', NULL, NULL,
    '/images/casa-lujo.jpg',
    'Piscina y zona de parrilla de la casa de lujo en Cañete',
    'Pool and grill area of the luxury home in Cañete',
    (SELECT id FROM property_groups WHERE slug = 'casas'),
    (SELECT id FROM zones WHERE slug = 'canete'),
    'Cañete, Lima', 'Cañete, Lima',
    (SELECT id FROM operations WHERE slug = 'venta'), true, 1
  ),
  (
    'SV-01', 'SV-01 · SAN VICENTE', 'SV-01 · SAN VICENTE',
    'Casa en San Vicente — km 148.5', 'Home in San Vicente — km 148.5',
    'Primer piso terminado con sala-comedor, chimenea, cocina, dos habitaciones, piscina y horno de barro. El segundo piso queda para ampliar.',
    'Finished first floor with living-dining room, fireplace, kitchen, two bedrooms, pool and clay oven. The second floor is ready to expand.',
    '214 m² terreno · 2 hab', '214 m² lot · 2 bed',
    'US$ 100,000', 'US$ 100,000', 100000, 'USD',
    '/images/casa-san-vicente.jpg',
    'Piscina y jardín de la casa en venta en San Vicente de Cañete',
    'Pool and garden of the home for sale in San Vicente de Cañete',
    (SELECT id FROM property_groups WHERE slug = 'casas'),
    (SELECT id FROM zones WHERE slug = 'san-vicente'),
    'San Vicente, Cañete', 'San Vicente, Cañete',
    (SELECT id FROM operations WHERE slug = 'venta'), true, 2
  ),
  (
    'SV-02', 'SV-02 · ALQUILER', 'SV-02 · RENT',
    'Casa en alquiler — Urb. Los Cipreces', 'Home for rent — Los Cipreces',
    '117 m² con sala-comedor, dos habitaciones, baño completo, cocina, lavandería y cochera. Ubicada en la Urbanización Los Cipreces, San Vicente.',
    '117 m² with living-dining room, two bedrooms, full bathroom, kitchen, laundry and covered parking. Located in Los Cipreces, San Vicente.',
    '117 m² · 2 hab · cochera', '117 m² · 2 bed · parking',
    'A consultar', 'Price on request', NULL, NULL,
    '/images/casa-alquiler.jpg',
    'Sala comedor de la casa en alquiler en Los Cipreces, San Vicente',
    'Living-dining room of the home for rent in Los Cipreces, San Vicente',
    (SELECT id FROM property_groups WHERE slug = 'casas'),
    (SELECT id FROM zones WHERE slug = 'san-vicente'),
    'San Vicente, Cañete', 'San Vicente, Cañete',
    (SELECT id FROM operations WHERE slug = 'alquiler'), true, 3
  );

INSERT INTO properties (
  id, ref, ref_en, name_es, name_en, description_es, description_en,
  meta_es, meta_en, price_text_es, price_text_en, price_amount, currency,
  image_src, alt_es, alt_en, group_id, zone_id, location_es, location_en,
  operation_id, published, sort_order
) VALUES
  (
    'CA-01', 'CA-01 · CERRO AZUL', 'CA-01 · CERRO AZUL',
    'Kusi Wasi — Cerro Azul', 'Kusi Wasi — Cerro Azul',
    'Lotes de campo desde 209 m² en el km 135 de la Panamericana Sur. Agua potable, cerco perimétrico, vigilancia y áreas para compartir.',
    'Country lots from 209 m² at km 135 of the Panamericana Sur. Drinking water, perimeter fence, security and shared areas.',
    'Lotes desde 209 m²', 'Lots from 209 m²',
    'A consultar', 'Price on request', NULL, NULL,
    '/images/kusi-wasi-cerro-azul.jpg',
    'Área verde en Kusi Wasi, Cerro Azul',
    'Green area at Kusi Wasi, Cerro Azul',
    (SELECT id FROM property_groups WHERE slug = 'terrenos'),
    (SELECT id FROM zones WHERE slug = 'cerro-azul'),
    'Cerro Azul, Cañete', 'Cerro Azul, Cañete',
    (SELECT id FROM operations WHERE slug = 'venta'), true, 4
  ),
  (
    'CH-01', 'CH-01 · CHINCHA', 'CH-01 · CHINCHA',
    'Kusi Wasi del Mar — Chincha', 'Kusi Wasi del Mar — Chincha',
    'Lotes frente al mar en el km 173 de la Panamericana Sur, en preventa. Título de propiedad, agua, luz y vigilancia 24/7.',
    'Beachfront lots at km 173 of the Panamericana Sur, in pre-sale. Land title, water, electricity and 24/7 security.',
    'Lotes frente al mar', 'Beachfront lots',
    'A consultar', 'Price on request', NULL, NULL,
    '/images/kusi-wasi-del-mar.jpg',
    'Lotes frente al mar en Kusi Wasi del Mar, Chincha',
    'Beachfront lots at Kusi Wasi del Mar, Chincha',
    (SELECT id FROM property_groups WHERE slug = 'terrenos'),
    (SELECT id FROM zones WHERE slug = 'chincha'),
    'Chincha, Ica', 'Chincha, Ica',
    (SELECT id FROM operations WHERE slug = 'venta'), true, 5
  ),
  (
    'SL-01', 'SL-01 · SAN LUIS', 'SL-01 · SAN LUIS',
    'Terrenos en San Luis de Cañete', 'Land in San Luis de Cañete',
    'Lotes de 109 m² y 1,000 m² a pocas cuadras de la plaza de armas, en zona habitada. Ideales para construir o invertir.',
    'Lots of 109 m² and 1,000 m² a few blocks from the main square, in a residential area. Ideal for building or investing.',
    '109 m² / 1,000 m²', '109 m² / 1,000 m²',
    'Desde S/ 30,000', 'From S/ 30,000', 30000, 'PEN',
    '/images/terrenos-san-luis.jpg',
    'Terreno en venta en San Luis de Cañete',
    'Land for sale in San Luis de Cañete',
    (SELECT id FROM property_groups WHERE slug = 'terrenos'),
    (SELECT id FROM zones WHERE slug = 'san-luis'),
    'San Luis, Cañete', 'San Luis, Cañete',
    (SELECT id FROM operations WHERE slug = 'venta'), true, 6
  );

INSERT INTO property_images (property_id, media_src, position) VALUES
  ('CAJ-01', '/images/casa-lujo.jpg', 1),
  ('CAJ-01', '/images/featured-casa-lujo.jpg', 2),
  ('SV-01', '/images/casa-san-vicente.jpg', 1),
  ('SV-02', '/images/casa-alquiler.jpg', 1),
  ('CA-01', '/images/kusi-wasi-cerro-azul.jpg', 1),
  ('CH-01', '/images/kusi-wasi-del-mar.jpg', 1),
  ('SL-01', '/images/terrenos-san-luis.jpg', 1);

INSERT INTO featured_home (id, property_id, image_src) VALUES
  (1, 'CAJ-01', '/images/featured-casa-lujo.jpg');

INSERT INTO featured_highlights (featured_id, position, text_es, text_en) VALUES
  (1, 1, '5 dormitorios con baño privado', '5 bedrooms with private bathroom'),
  (1, 2, '1,000 m² construidos · 660 m² de terreno', '1,000 m² built · 660 m² lot'),
  (1, 3, 'Piscina, terraza y parrilla', 'Pool, terrace and grill'),
  (1, 4, 'Bar y búnker', 'Bar and bunker');

INSERT INTO method_phases (
  number, position, title_es, title_en, you_es, you_en, us_es, us_en, time_es, time_en
) VALUES
  (
    '01', 1,
    'Cuéntanos qué buscas', 'Tell us what you''re looking for',
    'Zona, presupuesto y tipo de propiedad.', 'Area, budget and property type.',
    'Te damos un panorama real y opciones que encajan.', 'We give you a realistic overview and options that fit.',
    'A coordinar', 'To be arranged'
  ),
  (
    '02', 2,
    'Recibe opciones reales', 'Get real options',
    'Eliges las propiedades que quieres conocer.', 'You choose the properties you want to see.',
    'Te enviamos fichas con fotos, ubicación, metraje y precio.', 'We send listings with photos, location, size and price.',
    'Según disponibilidad', 'Based on availability'
  ),
  (
    '03', 3,
    'Visita la propiedad', 'Visit the property',
    'Conoces la propiedad y resuelves tus dudas.', 'You see the property and get your questions answered.',
    'Coordinamos la cita y revisamos los documentos disponibles.', 'We schedule the visit and review available documents.',
    'Con cita previa', 'By appointment'
  ),
  (
    '04', 4,
    'Cierra con acompañamiento', 'Close with support',
    'Decides con toda la información sobre la mesa.', 'You decide with all the information on the table.',
    'Te acompañamos en la oferta, el contrato y la transferencia.', 'We support you through the offer, contract and transfer.',
    'A coordinar', 'To be arranged'
  );

INSERT INTO site_contact (
  id, phone, whatsapp, instagram_handle, instagram_url, tiktok_handle, tiktok_url,
  service_location, service_area, visits_note
) VALUES (
  1,
  '+51 991 372 212',
  '51991372212',
  '@impulsoinmobiliariope',
  'https://www.instagram.com/impulsoinmobiliariope/',
  '@impulsoinmobiliariope',
  'https://www.tiktok.com/@impulsoinmobiliariope',
  'San Vicente de Cañete',
  'Cañete y Chincha',
  'Con cita previa'
);

INSERT INTO inquiry_types (slug, label_es, label_en, hint_es, hint_en, position) VALUES
  ('visita-propiedad', 'Visita a la propiedad', 'Property visit', 'Coordinamos día y hora', 'We arrange a date and time', 1),
  ('precio-financiamiento', 'Precio y financiamiento', 'Price and financing', 'Revisamos las condiciones', 'We review the terms', 2),
  ('vender-propiedad', 'Quiero vender mi propiedad', 'I want to sell my property', 'Evaluamos tu caso', 'We review your case', 3),
  ('otra-consulta', 'Otra consulta', 'Other inquiry', 'Escríbenos tu pregunta', 'Send us your question', 4);

INSERT INTO leads (
  property_id, inquiry_type_id, name, email, message, message_en,
  lang, status, is_demo, created_at, attended_at
) VALUES
  (
    'CH-01',
    (SELECT id FROM inquiry_types WHERE slug = 'visita-propiedad'),
    'María Quispe',
    'maria.quispe@gmail.com',
    'Quisiera coordinar una visita el sábado por la mañana para conocer los lotes frente al mar.',
    'I would like to arrange a visit on Saturday morning to see the beachfront lots.',
    'es', 'nueva', true, '2026-11-10T09:20:00-05:00', NULL
  ),
  (
    'SV-01',
    (SELECT id FROM inquiry_types WHERE slug = 'precio-financiamiento'),
    'Carlos Ruiz',
    'carlos.ruiz@outlook.com',
    'Me interesa la casa del km 148.5. Quisiera saber si el precio es negociable y qué opciones de financiamiento hay.',
    'I''m interested in the home at km 148.5. I''d like to know if the price is negotiable and what financing options are available.',
    'es', 'atendida', true, '2026-11-09T16:45:00-05:00', '2026-11-09T17:30:00-05:00'
  ),
  (
    'CAJ-01',
    (SELECT id FROM inquiry_types WHERE slug = 'visita-propiedad'),
    'Lucía Fernández',
    'lucia.fernandez@gmail.com',
    'Buenas tardes, quisiera ver la casa de lujo en Cañete. Estamos disponibles los fines de semana.',
    'Good afternoon, I would like to see the luxury home in Cañete. We are available on weekends.',
    'es', 'nueva', true, '2026-11-08T11:05:00-05:00', NULL
  );

INSERT INTO app_users (email, password_hash, full_name, role) VALUES
  (
    'asesor@impulsoinmobiliario.pe',
    crypt('impulso2026', gen_salt('bf', 10)),
    'Asesor Impulso',
    'advisor'
  );

COMMIT;
