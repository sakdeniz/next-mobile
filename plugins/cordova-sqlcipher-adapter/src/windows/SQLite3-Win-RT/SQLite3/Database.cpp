#include "Winerror.h"

#include "Database.h"
#include "Statement.h"

#include <string>

namespace SQLite3
{
  Database::Database(Platform::String^ dbPath)
    : sqlite(nullptr)
  {
    int ret = sqlite3_open16(dbPath->Data(), &sqlite);

    if (ret != SQLITE_OK)
    {
      sqlite3_close(sqlite);

      HRESULT hresult = MAKE_HRESULT(SEVERITY_ERROR, FACILITY_ITF, ret);
      throw ref new Platform::COMException(hresult);
    }

    sqlite3_db_config(sqlite, SQLITE_DBCONFIG_DEFENSIVE, 1, NULL);
  }

  Database::~Database()
  {
    if (sqlite != nullptr) sqlite3_close(sqlite);
  }

  int Database::Key(Platform::String^ key)
  {
    std::wstring wkey(key->Begin(), key->End());
    std::string skey(wkey.begin(), wkey.end());
    return sqlite3_key(sqlite, skey.c_str(), skey.length());
  }

  Statement^ Database::Prepare(Platform::String^ sql)
  {
    return ref new Statement(this, sql);
  }

  int Database::closedb()
  {
    int rc = sqlite3_close(sqlite);
	if (rc == SQLITE_OK) sqlite = nullptr;
	return rc;
  }

  int Database::close_v2()
  {
    int rc = sqlite3_close_v2(sqlite);
	if (rc == SQLITE_OK) sqlite = nullptr;
	return rc;
  }

  int Database::LastInsertRowid()
  {
    return sqlite3_last_insert_rowid(sqlite);
  }

  int Database::TotalChanges()
  {
    return sqlite3_total_changes(sqlite);
  }
}
